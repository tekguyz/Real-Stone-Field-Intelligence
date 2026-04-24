import { Job } from '../../entities/job/types';

export const mockJobs: Job[] = [
  {
    id: 'j-1001',
    legacy_id: 'WO-8402',
    client_name: 'Palm Beach Residency - Unit 402',
    location: {
      address: '142 Ocean Blvd',
      city: 'Palm Beach',
      state: 'FL',
      zip: '33480',
      community: 'The Breakers'
    },
    slab_info: {
      material: 'Taj Mahal Quartzite 3cm',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 4
    },
    status: 'in_progress',
    installer_id: 'installer_juan',
    install_date: '2026-04-24T08:00:00Z',
    logistics_notes: 'Gate Code: 1234. Use Service Elevator only. Protect marble floors.'
  },
  {
    id: 'j-1002',
    legacy_id: 'WO-8415',
    client_name: 'Jupiter Island Estate',
    location: {
      address: '881 S Beach Rd',
      city: 'Jupiter',
      state: 'FL',
      zip: '33469',
      community: 'The Bear\'s Club'
    },
    slab_info: {
      material: 'Calacatta Laza 3cm',
      finish: 'Honed',
      thickness: '3cm',
      slabs: 6
    },
    status: 'pending',
    install_date: '2026-04-26T09:00:00Z',
    logistics_notes: 'Must sign in at guard gate. Rear entrance for staging.'
  },
  {
    id: 'j-1003',
    legacy_id: 'WO-8418',
    client_name: 'Pompano Beach Penthouse',
    location: {
      address: '2200 N Ocean Blvd',
      city: 'Pompano Beach',
      state: 'FL',
      zip: '33062',
      community: 'Sabbia Beach'
    },
    slab_info: {
      material: 'Blue Roma 3cm',
      finish: 'Leathered',
      thickness: '3cm',
      slabs: 2
    },
    status: 'assigned',
    installer_id: 'installer_carlos',
    install_date: '2026-04-25T08:30:00Z',
    logistics_notes: 'Wait for concierge. Crane required for island slab.'
  },
  {
    id: 'j-1004',
    legacy_id: 'WO-8422',
    client_name: 'Coral Gables Historic Villa',
    location: {
      address: '401 Biltmore Way',
      city: 'Coral Gables',
      state: 'FL',
      zip: '33134',
      community: 'Biltmore Estates'
    },
    slab_info: {
      material: 'Nero Marquina 2cm',
      finish: 'Polished',
      thickness: '2cm',
      slabs: 3
    },
    status: 'submitted_for_review',
    installer_id: 'installer_juan',
    install_date: '2026-04-22T07:00:00Z',
    logistics_notes: 'Tight corners in stairwell. Double check seam at sink.'
  },
  {
    id: 'j-1005',
    legacy_id: 'WO-8425',
    client_name: 'Boca Raton Custom Build',
    location: {
      address: '501 E Camino Real',
      city: 'Boca Raton',
      state: 'FL',
      zip: '33432',
      community: 'Royal Palm Yacht & Country Club'
    },
    slab_info: {
      material: 'Cristallo Quartzite 3cm',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 8
    },
    status: 'verified',
    install_date: '2026-04-20T10:00:00Z',
    logistics_notes: 'High value material. Backlight check required.'
  },
  {
    id: 'j-1006',
    legacy_id: 'WO-8430',
    client_name: 'Fort Lauderdale Beach House',
    location: {
      address: '100 E Las Olas Blvd',
      city: 'Fort Lauderdale',
      state: 'FL',
      zip: '33301',
      community: 'Las Olas Isles'
    },
    slab_info: {
      material: 'Silver Travertine 2cm',
      finish: 'Honed',
      thickness: '2cm',
      slabs: 5
    },
    status: 'pending',
    install_date: '2026-04-28T08:00:00Z',
    logistics_notes: 'Check for matching grain on vanity backsplash.'
  },
  {
    id: 'j-1007',
    legacy_id: 'WO-8435',
    client_name: 'Wellington Equestrian Compound',
    location: {
      address: '12345 Pierson Rd',
      city: 'Wellington',
      state: 'FL',
      zip: '33414',
      community: 'Grand Hunter'
    },
    slab_info: {
      material: 'Bianco Carrara 3cm',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 3
    },
    status: 'assigned',
    installer_id: 'installer_juan',
    install_date: '2026-04-27T07:30:00Z',
    logistics_notes: 'Barn conversion. Rough ceiling height, verify template.'
  },
  {
    id: 'j-1008',
    legacy_id: 'WO-8440',
    client_name: 'Delray Beach Waterfront',
    location: {
      address: '150 E Atlantic Ave',
      city: 'Delray Beach',
      state: 'FL',
      zip: '33444',
      community: 'Mizner Country Club'
    },
    slab_info: {
      material: 'Statuario Marble 2cm',
      finish: 'Polished',
      thickness: '2cm',
      slabs: 4
    },
    status: 'in_progress',
    installer_id: 'installer_carlos',
    install_date: '2026-04-23T08:00:00Z',
    logistics_notes: 'Avoid using heavy equipment on driveway pavers.'
  },
  {
    id: 'j-1009',
    legacy_id: 'WO-8445',
    client_name: 'Miami Beach Luxury Sky',
    location: {
      address: '4525 Collins Ave',
      city: 'Miami Beach',
      state: 'FL',
      zip: '33140',
      community: 'Eden Roc'
    },
    slab_info: {
      material: 'Absolute Black Granite 3cm',
      finish: 'Leathered',
      thickness: '3cm',
      slabs: 7
    },
    status: 'submitted_for_review',
    installer_id: 'installer_carlos',
    install_date: '2026-04-21T09:00:00Z',
    logistics_notes: 'Full height backsplash. Needs mirror cutouts.'
  },
  {
    id: 'j-1010',
    legacy_id: 'WO-8450',
    client_name: 'Sunny Isles Developer Unit',
    location: {
      address: '17425 Collins Ave',
      city: 'Sunny Isles Beach',
      state: 'FL',
      zip: '33160',
      community: 'Jade Signature'
    },
    slab_info: {
      material: 'White Macaubas 3cm',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 12
    },
    status: 'verified',
    install_date: '2026-04-18T08:00:00Z',
    logistics_notes: 'High volume. 5 units total. Verify slab orientation.'
  },
  {
    id: 'j-1011',
    legacy_id: 'WO-8460',
    client_name: 'Manalapan Oceanfront',
    location: {
      address: '1100 S Ocean Blvd',
      city: 'Manalapan',
      state: 'FL',
      zip: '33462',
      community: 'Estate Section'
    },
    slab_info: {
      material: 'Michelangelo Marble 3cm',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 10
    },
    status: 'pending',
    install_date: '2026-04-30T07:00:00Z',
    logistics_notes: 'Extremely fragile. No suction cups on face.'
  },
  {
    id: 'j-1012',
    legacy_id: 'WO-8465',
    client_name: 'Palm Beach Gardens Estate',
    location: {
      address: '123 Old Marsh Way',
      city: 'Palm Beach Gardens',
      state: 'FL',
      zip: '33418',
      community: 'Old Marsh'
    },
    slab_info: {
      material: 'Fantasy Brown Quartzite',
      finish: 'Leathered',
      thickness: '3cm',
      slabs: 5
    },
    status: 'assigned',
    installer_id: 'installer_juan',
    install_date: '2026-04-29T08:30:00Z',
    logistics_notes: 'Outdoor kitchen. Use UV stable adhesive.'
  },
  {
    id: 'j-1013',
    legacy_id: 'WO-8470',
    client_name: 'West Palm Beach Commercial',
    location: {
      address: '501 S Flagler Dr',
      city: 'West Palm Beach',
      state: 'FL',
      zip: '33401',
      community: 'Phillips Point'
    },
    slab_info: {
      material: 'Caesarstone Empira White',
      finish: 'Polished',
      thickness: '2cm',
      slabs: 15
    },
    status: 'in_progress',
    installer_id: 'installer_juan',
    install_date: '2026-04-23T20:00:00Z',
    logistics_notes: 'Night install only. Loading dock B.'
  },
  {
    id: 'j-1014',
    legacy_id: 'WO-8475',
    client_name: 'Hillsboro Mile Mansion',
    location: {
      address: '1000 Hillsboro Mile',
      city: 'Hillsboro Beach',
      state: 'FL',
      zip: '33062',
      community: 'Millionaire Row'
    },
    slab_info: {
      material: 'Versace Gold Quartzite',
      finish: 'Polished',
      thickness: '3cm',
      slabs: 9
    },
    status: 'pending',
    install_date: '2026-05-01T08:00:00Z',
    logistics_notes: 'Check stone match across the waterfall edge.'
  },
  {
    id: 'j-1015',
    legacy_id: 'WO-8480',
    client_name: 'Singer Island Tower',
    location: {
      address: '2700 N Ocean Dr',
      city: 'Singer Island',
      state: 'FL',
      zip: '33404',
      community: 'Tiara'
    },
    slab_info: {
      material: 'Calacatta Borghese Marble',
      finish: 'Honed',
      thickness: '2cm',
      slabs: 4
    },
    status: 'verified',
    install_date: '2026-04-15T09:00:00Z',
    logistics_notes: 'High wind zone. Crane staging at the beach access.'
  }
];
