import { Job } from '../../entities/job/types';

export const mockJobs: Job[] = [
  {
    id: 'j-1001',
    legacy_id: 'WO-8402',
    project_id: 'p-1',
    client_name: 'Palm Beach Residency - Unit 402',
    address: '142 Ocean Blvd, Boca Raton, FL 33432',
    city_name: 'Boca Raton',
    community_name: 'Palm Beach Residency',
    stoneapp_parts: [
      { partType: 'Kitchen Island', material: 'Taj Mahal Quartzite 3cm', slabId: 'S-202X', thickness: '3cm', seams: 1, edgeProfile: 'Miter' },
      { partType: 'Perimeter', material: 'Taj Mahal Quartzite 3cm', slabId: 'S-203X', thickness: '3cm', seams: 2, edgeProfile: 'Eased' }
    ],
    status: 'submitted_for_review',
    job_type: 'install',
    installer_id: 'installer_juan',
    logistics_notes: 'Gate Code: 1234. Use Service Elevator.',
    photos: [
      'https://picsum.photos/seed/job1/800/600',
      'https://picsum.photos/seed/job1-2/800/600',
      'https://picsum.photos/seed/job1-3/800/600'
    ],
    signature_url: 'https://picsum.photos/seed/sig/400/200',
    scheduled_date: '2026-04-24T08:00:00Z',
    scheduled_arrival: '2026-04-24T08:00:00Z',
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-24T16:00:00Z'
  },
  {
    id: 'j-1002',
    legacy_id: 'WO-8415',
    project_id: 'p-2',
    client_name: 'Jupiter Island Estate',
    address: '881 S Beach Rd, Jupiter, FL 33469',
    city_name: 'Jupiter',
    community_name: 'Jupiter Island',
    stoneapp_parts: [
      { partType: 'Master Bath', material: 'Calacatta Laza 3cm', slabId: 'S-991A', thickness: '3cm', seams: 0, edgeProfile: 'Ogee' }
    ],
    status: 'assigned',
    job_type: 'install',
    installer_id: 'installer_juan',
    logistics_notes: 'Watch for newly planted sod. Park on driveway only.',
    scheduled_date: '2026-04-24T13:00:00Z',
    scheduled_arrival: '2026-04-24T13:00:00Z',
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-01T00:00:00Z'
  },
  {
    id: 'j-1003',
    legacy_id: 'WO-8501',
    project_id: 'p-3',
    client_name: 'Seaside Villas Condos',
    address: '1000 N A1A, Jupiter, FL 33477',
    city_name: 'Jupiter',
    community_name: 'Seaside Villas',
    stoneapp_parts: [
      { partType: 'Outdoor Kitchen', material: 'Absolute Black Granite Leathered', slabId: 'G-102', thickness: '3cm', seams: 1, edgeProfile: 'Eased' }
    ],
    status: 'assigned',
    job_type: 'install',
    installer_id: 'installer_juan',
    logistics_notes: 'Must check in at security desk. 3rd floor balcony.',
    scheduled_date: '2026-04-25T09:00:00Z',
    scheduled_arrival: '2026-04-25T09:00:00Z',
    created_at: '2026-04-05T00:00:00Z',
    updated_at: '2026-04-05T00:00:00Z'
  },
  {
    id: 'j-1004',
    legacy_id: 'WO-8550',
    project_id: 'p-4',
    client_name: 'Medalist Golf Club Home',
    address: '9900 SE Medalist Dr, Hobe Sound, FL 33455',
    city_name: 'Hobe Sound',
    community_name: 'Medalist Golf Club',
    stoneapp_parts: [
      { partType: 'Kitchen Perimeter', material: 'Super White Quartzite', slabId: 'Q-445', thickness: '3cm', seams: 2, edgeProfile: 'Ogee' },
      { partType: 'Pantry', material: 'Super White Quartzite', slabId: 'Q-445', thickness: '2cm', seams: 0, edgeProfile: 'Eased' }
    ],
    status: 'pending',
    job_type: 'template',
    installer_id: 'installer_carlos',
    logistics_notes: 'Gate guard has name block. Call homeowner 30 mins prior.',
    scheduled_date: '2026-04-24T08:30:00Z',
    scheduled_arrival: '2026-04-24T08:30:00Z',
    created_at: '2026-04-10T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z'
  },
  {
    id: 'j-1005',
    legacy_id: 'WO-8562',
    project_id: 'p-5',
    client_name: 'Tradition Townhome',
    address: '10500 SW Village Pkwy, Port St. Lucie, FL 34987',
    city_name: 'Port St. Lucie',
    community_name: 'Tradition',
    stoneapp_parts: [
      { partType: 'Master Bath Vanity', material: 'Carrara Marble', slabId: 'M-112', thickness: '2cm', seams: 0, edgeProfile: 'Eased' }
    ],
    status: 'assigned',
    job_type: 'install',
    installer_id: 'installer_carlos',
    logistics_notes: 'Townhome complex. Tight parking, use visitor spots.',
    scheduled_date: '2026-04-24T14:00:00Z',
    scheduled_arrival: '2026-04-24T14:00:00Z',
    created_at: '2026-04-11T00:00:00Z',
    updated_at: '2026-04-11T00:00:00Z'
  },
  {
    id: 'j-1006',
    legacy_id: 'WO-8588',
    project_id: 'p-6',
    client_name: 'Vero Beach Oceanfront',
    address: '4100 Ocean Dr, Vero Beach, FL 32963',
    city_name: 'Vero Beach',
    community_name: 'Oceanfront',
    stoneapp_parts: [
      { partType: 'Kitchen Island', material: 'Cristallo Quartzite', slabId: 'Q-889', thickness: '3cm', seams: 1, edgeProfile: 'Miter' },
      { partType: 'Fireplace Surround', material: 'Cristallo Quartzite', slabId: 'Q-889', thickness: '2cm', seams: 0, edgeProfile: 'Eased' }
    ],
    status: 'pending',
    job_type: 'template',
    installer_id: 'installer_carlos',
    logistics_notes: 'Use south entrance for service vehicles.',
    scheduled_date: '2026-04-25T10:00:00Z',
    scheduled_arrival: '2026-04-25T10:00:00Z',
    created_at: '2026-04-15T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z'
  },
  {
    id: 'j-1007',
    legacy_id: 'WO-8601',
    project_id: 'p-7',
    client_name: 'Boynton Beach Renovation',
    address: '1200 S Federal Hwy, Boynton Beach, FL 33435',
    city_name: 'Boynton Beach',
    community_name: 'Renovation',
    stoneapp_parts: [
      { partType: 'Bar Top', material: 'Blue Dunes Granite', slabId: 'G-305', thickness: '3cm', seams: 0, edgeProfile: 'Bullnose' }
    ],
    status: 'pending',
    job_type: 'install',
    installer_id: null,
    logistics_notes: 'Contractor lockbox code: 0424',
    scheduled_date: '2026-04-26T08:00:00Z',
    scheduled_arrival: '2026-04-26T08:00:00Z',
    created_at: '2026-04-18T00:00:00Z',
    updated_at: '2026-04-18T00:00:00Z'
  },
  {
    id: 'j-1008',
    legacy_id: 'WO-8610',
    project_id: 'p-8',
    client_name: 'PGA Village Estate',
    address: '8800 PGA Blvd, Port St. Lucie, FL 34986',
    city_name: 'Port St. Lucie',
    community_name: 'PGA Village',
    stoneapp_parts: [
      { partType: 'Kitchen Perimeter', material: 'Silestone Calacatta Gold', slabId: 'QTZ-01', thickness: '3cm', seams: 2, edgeProfile: 'Eased' }
    ],
    status: 'pending',
    job_type: 'install',
    installer_id: null,
    logistics_notes: 'Show vendor pass at main gate.',
    scheduled_date: null,
    scheduled_arrival: null,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z'
  },
  {
    id: 'j-1009',
    legacy_id: 'WO-8622',
    project_id: 'p-9',
    client_name: 'Boca Raton Office Park',
    address: '2200 Glades Rd, Boca Raton, FL 33431',
    city_name: 'Boca Raton',
    community_name: 'Office Park',
    stoneapp_parts: [
      { partType: 'Reception Desk', material: 'Nero Marquina Marble', slabId: 'M-500', thickness: '2cm', seams: 1, edgeProfile: 'Miter' }
    ],
    status: 'pending',
    job_type: 'install',
    installer_id: null,
    logistics_notes: 'Loading dock in the rear. Freight elevator reserved for 9AM.',
    scheduled_date: '2026-04-27T09:00:00Z',
    scheduled_arrival: '2026-04-27T09:00:00Z',
    created_at: '2026-04-21T00:00:00Z',
    updated_at: '2026-04-21T00:00:00Z'
  },
  {
    id: 'j-1010',
    legacy_id: 'WO-8640',
    project_id: 'p-10',
    client_name: 'Sailfish Point Residence',
    address: '2000 SE Sailfish Point Blvd, Stuart, FL 34996',
    city_name: 'Stuart',
    community_name: 'Sailfish Point',
    stoneapp_parts: [
      { partType: 'Master Bath', material: 'Onyx', slabId: 'O-111', thickness: '2cm', seams: 0, edgeProfile: 'Ogee' }
    ],
    status: 'pending',
    job_type: 'template',
    installer_id: null,
    logistics_notes: 'Requires 24hr advance notice for gate clearance.',
    scheduled_date: null,
    scheduled_arrival: null,
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z'
  }
];
