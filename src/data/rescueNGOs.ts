export interface NGOOrganization {
  id: string;
  name: string;
  type: 'Food Rescue' | 'Food Distribution' | 'Community Kitchen' | 'Hunger Relief' | 'Emergency Food Assistance' | 'Shelter';
  city: string;
  state: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description: string;
  services: string[];
}

export interface CityData {
  city: string;
  organizations: NGOOrganization[];
}

export interface StateData {
  state: string;
  cities: CityData[];
}

export const INDIAN_STATES_AND_UTS = [
  'Odisha',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Jammu & Kashmir',
  'Puducherry',
  'Chandigarh'
];

export const RESCUE_NGO_DATABASE: StateData[] = [
  {
    state: 'Odisha',
    cities: [
      {
        city: 'Bhubaneswar',
        organizations: [
          {
            id: 'ngo-bbsr-1',
            name: 'Robin Hood Army — Bhubaneswar Chapter',
            type: 'Food Rescue',
            city: 'Bhubaneswar',
            state: 'Odisha',
            address: 'District Hub, Saheed Nagar & Patia Dispatch Dock, Bhubaneswar, Odisha 751007',
            phone: '+919861012345',
            email: 'bhubaneswar@robinhoodarmy.com',
            website: 'https://robinhoodarmy.com',
            description: 'Volunteer-driven food rescue organization that collects excess unserved food from campus messes, hostels, and weddings to distribute to vulnerable communities across Bhubaneswar.',
            services: ['Campus Surplus Food Rescue', 'Night Food Drives', 'Shelter Redistribution']
          },
          {
            id: 'ngo-bbsr-2',
            name: 'Feeding India by Zomato — Bhubaneswar',
            type: 'Food Distribution',
            city: 'Bhubaneswar',
            state: 'Odisha',
            address: 'Jayadev Vihar Main Square, Bhubaneswar, Odisha 751013',
            phone: '+919437011223',
            email: 'contact@feedingindia.org',
            website: 'https://www.feedingindia.org',
            description: 'Non-profit network dedicated to solving hunger and malnutrition in India by repurposing surplus food from institutional kitchens into nutritious daily meals.',
            services: ['Institutional Surplus Rescue', 'Daily Meal Centers', 'Child Nutrition Drive']
          },
          {
            id: 'ngo-bbsr-3',
            name: 'Aahaar Kendra Community Kitchen — Capital Hospital Hub',
            type: 'Community Kitchen',
            city: 'Bhubaneswar',
            state: 'Odisha',
            address: 'Capital Hospital Premises, Unit 6, Bhubaneswar, Odisha 751001',
            phone: '+916742390112',
            email: 'aahaar.odisha@gov.in',
            website: 'https://aahaar.odisha.gov.in',
            description: 'Government of Odisha subsidized food rescue initiative providing hygienic hot cooked meals to hospital attendees, daily wagers, and urban poor.',
            services: ['Community Kitchen', 'Emergency Meal Assistance', 'Clean Water Station']
          },
          {
            id: 'ngo-bbsr-4',
            name: 'Puri Shrine & Regional Food Relief Trust',
            type: 'Hunger Relief',
            city: 'Bhubaneswar',
            state: 'Odisha',
            address: 'Old Town Heritage Corridor, Bhubaneswar, Odisha 751002',
            phone: '+916742430099',
            email: 'relieftrust@odishafoodbank.org',
            website: 'https://odishafoodbank.org',
            description: 'Regional food relief network coordinating large-scale food donation drives and disaster relief meal packages across Coastal Odisha.',
            services: ['Disaster Emergency Food', 'Bulk Grain Bank', 'Community Feast Rescue']
          }
        ]
      },
      {
        city: 'Cuttack',
        organizations: [
          {
            id: 'ngo-[#C86D44]-ctk-1',
            name: 'Silver City Food Rescue Network',
            type: 'Food Rescue',
            city: 'Cuttack',
            state: 'Odisha',
            address: 'Choudhury Bazar, Cuttack, Odisha 753001',
            phone: '+919438099887',
            email: 'cuttack@foodrescue.in',
            website: 'https://foodrescue.in',
            description: 'Collects untouched food from university canteens and banquet halls in Cuttack for distribution at SCB Medical College shelter homes.',
            services: ['Night Meal Rescue', 'Medical Shelter Distribution']
          }
        ]
      },
      {
        city: 'Rourkela',
        organizations: [
          {
            id: 'ngo-rkl-1',
            name: 'Steel City Hunger Relief Mission',
            type: 'Hunger Relief',
            city: 'Rourkela',
            state: 'Odisha',
            address: 'Civil Township Sector 4, Rourkela, Odisha 769004',
            phone: '+916612500445',
            email: 'rourkela@hungerrelief.org',
            website: 'https://hungerrelief.org',
            description: 'Distributes surplus grain and cooked meals to worker colonies and rural pockets surrounding Rourkela.',
            services: ['Industrial Colony Distribution', 'Dry Ration Kits']
          }
        ]
      }
    ]
  },
  {
    state: 'Delhi',
    cities: [
      {
        city: 'New Delhi',
        organizations: [
          {
            id: 'ngo-del-1',
            name: 'No Food Waste — Delhi Chapter',
            type: 'Food Rescue',
            city: 'New Delhi',
            state: 'Delhi',
            address: 'Connaught Place Outer Circle, New Delhi 110001',
            phone: '+919911223344',
            email: 'delhi@nofoodwaste.org',
            website: 'https://nofoodwaste.org',
            description: 'Helps retrieve untouched surplus food from corporate dining facilities and college campuses to feed night shelters.',
            services: ['Corporate Food Rescue', 'Night Shelter Meals']
          },
          {
            id: 'ngo-del-2',
            name: 'Annamrita Foundation Delhi',
            type: 'Community Kitchen',
            city: 'New Delhi',
            state: 'Delhi',
            address: 'Okhla Industrial Area Phase 1, New Delhi 110020',
            phone: '+911140506070',
            email: 'delhi@annamrita.org',
            website: 'https://annamrita.org',
            description: 'Large-scale automated kitchen facility preparing wholesome meals for underprivileged students and emergency hunger spots.',
            services: ['Mid-Day Meal Program', 'Emergency Food Supply']
          }
        ]
      }
    ]
  },
  {
    state: 'Maharashtra',
    cities: [
      {
        city: 'Mumbai',
        organizations: [
          {
            id: 'ngo-mum-1',
            name: 'Roti Bank Mumbai (By Dabbawalas)',
            type: 'Food Rescue',
            city: 'Mumbai',
            state: 'Maharashtra',
            address: 'Lower Parel Station Road, Mumbai, Maharashtra 400013',
            phone: '+918655580000',
            email: 'info@rotibankmumbai.org',
            website: 'https://rotibankmumbai.org',
            description: 'Initiated by Mumbai Dabbawalas to pick up leftover food from events, campus messes, and hotels in mobile vans.',
            services: ['Mobile Food Van Rescue', 'Slum Outreach']
          }
        ]
      },
      {
        city: 'Pune',
        organizations: [
          {
            id: 'ngo-pune-1',
            name: 'Pune Hunger Direct & Food Bank',
            type: 'Food Distribution',
            city: 'Pune',
            state: 'Maharashtra',
            address: 'Kothrud Central Square, Pune, Maharashtra 411038',
            phone: '+919822011223',
            email: 'pune@hungerdirect.org',
            website: 'https://hungerdirect.org',
            description: 'Connects student volunteer groups with mess managers to collect evening tea snacks and dinner surplus.',
            services: ['Hostel Surplus Drive', 'Community Pantry']
          }
        ]
      }
    ]
  },
  {
    state: 'Karnataka',
    cities: [
      {
        city: 'Bengaluru',
        organizations: [
          {
            id: 'ngo-blr-1',
            name: 'Akshaya Patra Foundation Hub',
            type: 'Community Kitchen',
            city: 'Bengaluru',
            state: 'Karnataka',
            address: 'HKBK Campus Road, Rajajinagar, Bengaluru, Karnataka 560010',
            phone: '+918023371411',
            email: 'infodesk@akshayapatra.org',
            website: 'https://www.akshayapatra.org',
            description: 'World’s largest NGO-run mid-day meal program leveraging high-capacity kitchens for daily food distribution.',
            services: ['Mega Kitchen Relief', 'School Meal Program']
          }
        ]
      }
    ]
  },
  {
    state: 'West Bengal',
    cities: [
      {
        city: 'Kolkata',
        organizations: [
          {
            id: 'ngo-kol-1',
            name: 'Kolkata Food Rescue Initiative',
            type: 'Food Rescue',
            city: 'Kolkata',
            state: 'West Bengal',
            address: 'Park Street Metro Precinct, Kolkata, West Bengal 700016',
            phone: '+919830012345',
            email: 'kolkata@foodrescue.in',
            website: 'https://foodrescue.in',
            description: 'Collects untouched surplus meals from university hostels and banquet halls along the E.M. Bypass corridor.',
            services: ['Campus Meal Rescue', 'Station Shelter Outreach']
          }
        ]
      }
    ]
  }
];
