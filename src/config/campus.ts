/**
 * ReUseHub - Campus Configuration (Single Source of Truth)
 * 
 * NOTE: Per project requirements, NO college identity or campus details
 * may be hardcoded anywhere else in the application.
 */

export interface CampusPickupPoint {
  id: string
  name: string
  building: string
  floor: string
  landmark: string
  instructions: string
  activeHours: string
  coordinates?: { lat: number; lng: number }
}

export interface CampusDepartmentConfig {
  id: string
  name: string
  code: string
  building: string
  description: string
  iconName: string
}

export interface CampusConfig {
  name: string
  shortName: string
  logoText: string
  tagline: string
  emailDomain: string
  officeAddress: string
  supportEmail: string
  officeHours: string
  departmentName: string
  sponsoringLab: string
  theme: string
  website: string
  pickupPoints: CampusPickupPoint[]
  departments: CampusDepartmentConfig[]
}

export const campusConfig: CampusConfig = {
  name: 'Shree L. R. Tiwari College of Engineering',
  shortName: 'SLRTCE',
  logoText: 'ReUseHub @ SLRTCE',
  tagline: 'Give it a second life.',
  emailDomain: 'slrtce.in',
  officeAddress: "Kanakia Park, Near Commissioner's Bungalow, Mira Road (East), Thane 401107, Maharashtra",
  supportEmail: 'sustainability@slrtce.in',
  officeHours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  departmentName: 'Department of Information Technology',
  sponsoringLab: 'IDEA Lab-1',
  theme: 'Digital Empowerment for All',
  website: 'https://slrtce.in',

  pickupPoints: [
    {
      id: 'pp-idea-lab',
      name: 'IDEA Lab-1 & IoT Makerspace',
      building: 'Technology Complex',
      floor: '4th Floor, Room 402',
      landmark: 'Next to Embedded Systems Lab',
      instructions: 'Ask for the ReUseHub station supervisor or lab assistant on duty.',
      activeHours: '9:30 AM – 5:00 PM',
    },
    {
      id: 'pp-central-library',
      name: 'Central Library Circulation Desk',
      building: 'Main Administrative Block',
      floor: 'Ground Floor',
      landmark: 'Left side of turnstile gate',
      instructions: 'Hand over item package with reference ID at the designated Green Shelf.',
      activeHours: '8:30 AM – 7:00 PM',
    },
    {
      id: 'pp-canteen-foyer',
      name: 'Student Canteen Courtyard Foyer',
      building: 'Student Amenities Block',
      floor: 'Ground Floor',
      landmark: 'Opposite Student Council Notice Board',
      instructions: 'Meet directly at the high-top circular discussion table near the notice board.',
      activeHours: '10:00 AM – 4:30 PM',
    },
    {
      id: 'pp-workshop',
      name: 'Central Workshop & Fabrication Center',
      building: 'Mechanical & Fabrication Annex',
      floor: 'Ground Floor, Bay 2',
      landmark: 'Tool Crib & Material Issue Desk',
      instructions: 'Ideal for heavier items, hardware components, or bulk tools.',
      activeHours: '9:00 AM – 4:30 PM',
    },
    {
      id: 'pp-gymkhana',
      name: 'Gymkhana & Sports Complex Reception',
      building: 'Sports Complex',
      floor: '1st Floor',
      landmark: 'Main Trophy Display Gallery',
      instructions: 'Recommended for sports gear, gym accessories, or dorm items.',
      activeHours: '8:00 AM – 6:00 PM',
    },
  ],

  departments: [
    {
      id: 'dept-it',
      name: 'Information Technology',
      code: 'IT',
      building: 'Technology Complex (4th Floor)',
      description: 'Computing, Software Systems, IoT & IDEA Lab Hub',
      iconName: 'Cpu',
    },
    {
      id: 'dept-comps',
      name: 'Computer Engineering',
      code: 'COMP',
      building: 'Technology Complex (3rd Floor)',
      description: 'Core Computing, AI/ML, Networks & Systems',
      iconName: 'Laptop',
    },
    {
      id: 'dept-ecs',
      name: 'Electronics and Computer Science',
      code: 'ECS',
      building: 'Technology Complex (2nd Floor)',
      description: 'Embedded Hardware, VLSI & Microcontrollers',
      iconName: 'CircuitBoard',
    },
    {
      id: 'dept-extc',
      name: 'Electronics and Telecom Engineering',
      code: 'EXTC',
      building: 'Main Block (3rd Floor)',
      description: 'RF, Signal Processing, Antennas & Communication',
      iconName: 'Radio',
    },
    {
      id: 'dept-mech',
      name: 'Mechanical Engineering',
      code: 'MECH',
      building: 'Mechanical Annex & Workshop Bay',
      description: 'Robotics, Design, CAD/CAM & Fabrication',
      iconName: 'Wrench',
    },
    {
      id: 'dept-civil',
      name: 'Civil Engineering',
      code: 'CIVIL',
      building: 'East Wing Block (1st & 2nd Floor)',
      description: 'Drafting Tools, Surveying Rigs & Structural Models',
      iconName: 'Building',
    },
    {
      id: 'dept-applied-sciences',
      name: 'Applied Sciences & Humanities',
      code: 'F.E.',
      building: 'First Year Academic Complex',
      description: 'Engineering Physics, Chemistry & First-Year Foundations',
      iconName: 'FlaskConical',
    },
    {
      id: 'dept-mgmt',
      name: 'Humanities and Management Studies',
      code: 'H&M',
      building: 'Administrative Block (2nd Floor)',
      description: 'Economics, Communication Skills & Project Management',
      iconName: 'BookOpen',
    },
  ],
}
