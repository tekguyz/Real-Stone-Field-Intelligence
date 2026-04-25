import Papa from 'papaparse';
import { useState } from 'react';
import { Job, JobScopePart } from '../../../entities/job/types';

interface StoneAppCSVRow {
  'Work Order #': string;
  'Customer Name': string;
  'Scheduled Date/Time': string;
  'City': string;
  'Community': string;
  'Address': string;
  'Job Scope': string;
  [key: string]: string;
}

export function useStoneAppIngestion(existingJobs: Job[] = []) {
  const [parsedData, setParsedData] = useState<(Job & { conflict?: boolean })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const parseCSV = (file: File) => {
    setIsParsing(true);
    setError(null);
    
    // Create a set of existing WO numbers for fast lookup
    const existingWoSet = new Set(existingJobs.map(j => j.wo_number || j.legacy_id));
    
    Papa.parse<StoneAppCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const jobs = results.data.map((row, index) => {
            const woNumber = row['Work Order #'] || `IM-${Date.now()}-${index}`;
            const address = row['Address'] || '';
            const scopeText = row['Job Scope'] || '';
            const installerName = row['Installer'] || row['Assigned To'] || null;
            const isConflict = existingWoSet.has(woNumber);
            
            // Basic scope parsing: "Part (Material) | Part (Material)"
            const stoneapp_parts: JobScopePart[] = scopeText.split('|').map(segment => {
              const cleaned = segment.trim();
              const match = cleaned.match(/^(.*?)\((.*?)\)$/);
              if (match) {
                return {
                  partType: match[1].trim(),
                  material: match[2].trim(),
                  slabId: 'TBD',
                  thickness: '3cm',
                  seams: 0,
                  edgeProfile: 'Eased'
                };
              }
              return {
                partType: cleaned,
                material: 'TBD',
                slabId: 'TBD',
                thickness: '3cm',
                seams: 0,
                edgeProfile: 'Eased'
              };
            });

            return {
              id: woNumber, // Temporarily use WO# as ID for mock
              legacy_id: woNumber,
              wo_number: woNumber,
              project_id: null,
              client_name: row['Customer Name'] || 'Unknown Customer',
              address: address,
              city_name: row['City'] || null,
              community_name: row['Community'] || null,
              stoneapp_parts: stoneapp_parts.length > 0 ? stoneapp_parts : null,
              status: 'pending' as Job['status'],
              job_type: 'install' as Job['job_type'],
              scheduled_date: row['Scheduled Date/Time'] || null,
              scheduled_arrival: row['Scheduled Date/Time'] || null,
              installer_id: null,
              logistics_notes: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              conflict: isConflict
            };
          });

          setParsedData(jobs);
        } catch (err) {
          setError('Failed to process CSV data structure.');
          console.error(err);
        } finally {
          setIsParsing(false);
        }
      },
      error: (err) => {
        setError(`CSV Error: ${err.message}`);
        setIsParsing(false);
      }
    });
  };

  const clearData = () => {
    setParsedData([]);
    setError(null);
  };

  return {
    parseCSV,
    parsedData,
    error,
    isParsing,
    clearData
  };
}
