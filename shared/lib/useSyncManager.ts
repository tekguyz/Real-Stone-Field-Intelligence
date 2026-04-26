import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { db } from "../api/sync-queue";
import { jobService } from "../../entities/job/api";
import { useUserStore } from "../../entities/user/store";

export type SyncStatus = "ONLINE" | "OFFLINE" | "SYNCING";

export function useSyncManager() {
  const [status, setStatus] = useState<SyncStatus>(() => {
    if (typeof window !== "undefined") {
      return navigator.onLine ? "ONLINE" : "OFFLINE";
    }
    return "OFFLINE";
  });
  const [pendingCount, setPendingCount] = useState(0);
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  const clearErrors = async () => {
    await db.sync_queue.where("status").equals("failed_permanently").delete();
    const count = await db.sync_queue.count();
    setPendingCount(count);
  };

  const flushQueue = useCallback(async () => {
    if (isDevMode) return;

    const items = await db.sync_queue.toArray();
    const pendingItems = items.filter((i) => i.status !== "failed_permanently");

    if (pendingItems.length === 0) {
      const anyFailed = items.some((i) => i.status === "failed_permanently");
      setStatus(
        anyFailed ? "OFFLINE" : navigator.onLine ? "ONLINE" : "OFFLINE",
      );
      return;
    }

    setStatus("SYNCING");

    for (const item of pendingItems) {
      if ((item.attempts || 0) >= 3) {
        await db.sync_queue.update(item.id!, { status: "failed_permanently" });
        continue;
      }

      try {
        if (item.action === "UPLOAD_PHOTO") {
          await jobService.uploadPhoto(
            item.payload.blob,
            item.payload.jobId,
            isDevMode,
          );
        } else if (item.action === "UPLOAD_SIGNATURE") {
          await jobService.uploadSignature(
            item.payload.data,
            item.payload.jobId,
            isDevMode,
          );
        } else if (item.action === "UPDATE_STATUS") {
          await jobService.updateJobStatus(
            item.payload.jobId,
            item.payload.newStatus,
            isDevMode,
          );
        }
        await db.sync_queue.delete(item.id!);
      } catch (err) {
        console.error("Sync failed for item", item, err);
        const nextAttempts = (item.attempts || 0) + 1;
        await db.sync_queue.update(item.id!, {
          attempts: nextAttempts,
          status: nextAttempts >= 3 ? "failed_permanently" : "pending",
        });
        break;
      }
    }

    const allRemaining = await db.sync_queue.toArray();
    const remainingPending = allRemaining.filter(
      (i) => i.status !== "failed_permanently",
    ).length;
    const permanentlyFailed = allRemaining.filter(
      (i) => i.status === "failed_permanently",
    ).length;

    setPendingCount(remainingPending + permanentlyFailed);
    setStatus(
      permanentlyFailed > 0
        ? "OFFLINE"
        : navigator.onLine
          ? "ONLINE"
          : "OFFLINE",
    );

    if (remainingPending === 0) {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  }, [isDevMode, queryClient]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndFlush = async () => {
      const count = await db.sync_queue.count();
      setPendingCount(count);
      if (count > 0 && navigator.onLine) {
        flushQueue();
      }
    };

    const handleOnline = () => {
      setStatus("ONLINE");
      flushQueue();
    };

    const handleOffline = () => setStatus("OFFLINE");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkAndFlush();
    const interval = setInterval(checkAndFlush, 15000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [flushQueue]);

  return { status, pendingCount, clearErrors };
}
