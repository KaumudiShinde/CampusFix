export const MOCK_COMPLAINTS = [
  {
    id: 1,
    ticket_id: "CMP-7F9A2B",
    title: "Main Auditorium AC Unit Leaking & Noise",
    description: "The central AC on the right side of the main auditorium is making loud buzzing noises and dripping water onto seats 12-15.",
    category: "electrical",
    location_building: "Central Block",
    room_number: "Auditorium Hall A",
    priority: "high",
    status: "in_progress",
    complainant_name: "Rahul Sharma",
    assigned_staff_name: "Vikram Tech Team",
    upvotes: 14,
    created_at: "2026-08-16T10:30:00Z",
    resolution_notes: "Compressor inspected. Technician assigned for replacement valve."
  },
  {
    id: 2,
    ticket_id: "CMP-4E12C8",
    title: "Projector HDMI Port Damaged in CS Lab 3",
    description: "The overhead projector cannot detect laptop HDMI inputs. Cable head appears bent.",
    category: "it_network",
    location_building: "Tech Block B",
    room_number: "CS Lab 304",
    priority: "medium",
    status: "pending",
    complainant_name: "Ananya Roy",
    assigned_staff_name: "Unassigned",
    upvotes: 8,
    created_at: "2026-08-17T09:15:00Z",
    resolution_notes: ""
  },
  {
    id: 3,
    ticket_id: "CMP-9D33A1",
    title: "Flush Tank Leakage in 2nd Floor Boys Washroom",
    description: "Water leaking continuously on floor causing slippery hazard near Room 208.",
    category: "plumbing",
    location_building: "Science Wing",
    room_number: "2nd Floor Washroom",
    priority: "urgent",
    status: "assigned",
    complainant_name: "Karan Patel",
    assigned_staff_name: "Ramesh Plumbing Dept",
    upvotes: 22,
    created_at: "2026-08-17T14:45:00Z",
    resolution_notes: "Main valve temporarily shut off."
  },
  {
    id: 4,
    ticket_id: "CMP-1100FF",
    title: "Broken Benches & Desk Screws Loose",
    description: "Three wooden desk benches in Lecture Hall 102 are wobbly and unsafe for students.",
    category: "furniture",
    location_building: "Academic Block 1",
    room_number: "Lecture Hall 102",
    priority: "low",
    status: "resolved",
    complainant_name: "Priya Nair",
    assigned_staff_name: "Suresh Carpentry",
    upvotes: 5,
    created_at: "2026-08-14T08:20:00Z",
    resolution_notes: "Replaced 4 metal brackets and tightened all desk bolts."
  }
];

export const MOCK_BUILDINGS = [
  { id: 'central', name: 'Central Block', openIssues: 4, resolvedIssues: 18 },
  { id: 'tech_b', name: 'Tech Block B', openIssues: 6, resolvedIssues: 24 },
  { id: 'science', name: 'Science Wing', openIssues: 3, resolvedIssues: 12 },
  { id: 'academic_1', name: 'Academic Block 1', openIssues: 1, resolvedIssues: 30 },
  { id: 'hostel_a', name: 'Student Hostel Block A', openIssues: 5, resolvedIssues: 15 },
];
