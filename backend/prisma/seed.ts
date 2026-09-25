import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "path";
import {
  FuelType,
  PrismaClient,
  TransmissionType,
} from "../generated/prisma/client";

dotenv.config({ path: path.resolve(__dirname, "../.env.development") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const cities = [
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Hyderabad", state: "Telangana" },
];

const subLocations: Record<
  string,
  {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }[]
> = {
  Bengaluru: [
    {
      name: "Kempegowda International Airport",
      address: "Devanahalli, Bengaluru 562300",
      lat: 13.1979,
      lng: 77.7063,
    },
    {
      name: "Marathahalli",
      address: "Marathahalli Bridge, Bengaluru 560037",
      lat: 12.9591,
      lng: 77.6974,
    },
    {
      name: "Electronic City",
      address: "Electronic City Phase I, Bengaluru 562025",
      lat: 12.8828,
      lng: 77.6453,
    },
    {
      name: "Jayanagar",
      address: "Jayanagar 2nd Block, Bengaluru 560011",
      lat: 12.9447,
      lng: 77.5964,
    },
    {
      name: "Indiranagar",
      address: "2nd Stage, Indiranagar, Bengaluru 560075",
      lat: 12.9861,
      lng: 77.6213,
    },
  ],
  Mumbai: [
    {
      name: "Chhatrapati Shivaji Maharaj Terminus (CST)",
      address: "D N Road, Opposite CST Station, Mumbai 400001",
      lat: 19.0175,
      lng: 72.8829,
    },
    {
      name: "Mumbai Central",
      address:
        "Mumbai Central Station, Near Western Railway Terminus, Mumbai 400008",
      lat: 19.0531,
      lng: 72.8533,
    },
    {
      name: "Andheri (East)",
      address: "S V Road, Andheri East, Mumbai 400069",
      lat: 19.1335,
      lng: 72.8706,
    },
    {
      name: "Bandra (West)",
      address: "Bandra West, Bandra Station, Mumbai 400050",
      lat: 19.0349,
      lng: 72.8447,
    },
  ],
  Hyderabad: [
    {
      name: "Rajiv Gandhi International Airport (RGIA)",
      address: "Shamshabad, Hyderabad 500409",
      lat: 17.2354,
      lng: 78.4372,
    },
    {
      name: "Secunderabad Railway Station",
      address: "Near Parade Grounds, Secunderabad 500003",
      lat: 17.4296,
      lng: 78.4825,
    },
    {
      name: "Hyderabad (Deccan)",
      address: "Near Charminar, Hyderabad 500002",
      lat: 17.3634,
      lng: 78.4767,
    },
  ],
};

interface CarTemplate {
  name: string;
  brand: string;
  year: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  kmLimitPerDay: number;
  pricePerHour: number;
  pricePerDay: number;
  extraKmCharge: number;
  features: string[];
  images: string[];
}

const carTemplates: CarTemplate[] = [
  {
    name: "Tata Tigor",
    brand: "Tata",
    year: "2023",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 85,
    pricePerDay: 1299,
    extraKmCharge: 12,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/TATA/TIGOR/2023/4SA.JPG",
    ],
  },
  {
    name: "Maruti Suzuki Swift",
    brand: "Maruti Suzuki",
    year: "2022",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    kmLimitPerDay: 250,
    pricePerHour: 70,
    pricePerDay: 1099,
    extraKmCharge: 10,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Front Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/MARUTI/SWIFT/2022/4SA.JPG",
    ],
  },
  {
    name: "Hyundai Verna",
    brand: "Hyundai",
    year: "2023",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 350,
    pricePerHour: 95,
    pricePerDay: 1499,
    extraKmCharge: 15,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/HYUNDAI/VERNA/2023/4SA.JPG",
    ],
  },
  {
    name: "Toyota Innova Crysta",
    brand: "Toyota",
    year: "2017",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 8,
    kmLimitPerDay: 200,
    pricePerHour: 80,
    pricePerDay: 1299,
    extraKmCharge: 12,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Front Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/TOYOTA/INNOVA%20CRYSTA/2017/4SA.JPG",
    ],
  },
  {
    name: "Honda City",
    brand: "Honda",
    year: "2022",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 90,
    pricePerDay: 1499,
    extraKmCharge: 15,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/HONDA/CITY/2022/4SA.JPG",
    ],
  },
  {
    name: "Ford Figo",
    brand: "Ford",
    year: "2015",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 250,
    pricePerHour: 65,
    pricePerDay: 999,
    extraKmCharge: 10,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Front Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/FORD/FIGO/2015/4SA.JPG",
    ],
  },
  {
    name: "Mahindra XUV300",
    brand: "Mahindra",
    year: "2020",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 7,
    kmLimitPerDay: 350,
    pricePerHour: 95,
    pricePerDay: 1499,
    extraKmCharge: 15,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/MHDA/XUV%20300/2020/4SA.JPG",
    ],
  },
  {
    name: "Renault Kwid",
    brand: "Renault",
    year: "2015",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 250,
    pricePerHour: 65,
    pricePerDay: 999,
    extraKmCharge: 10,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Front Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/RENAULT/KWID/2015/4SA.JPG",
    ],
  },
  {
    name: "Skoda Rapid",
    brand: "Skoda",
    year: "2020",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 90,
    pricePerDay: 1499,
    extraKmCharge: 15,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/SKODA/RAPID/2020/4SA.JPG",
    ],
  },
  {
    name: "Volkswagen Polo",
    brand: "Volkswagen",
    year: "2015",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 250,
    pricePerHour: 65,
    pricePerDay: 999,
    extraKmCharge: 10,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Front Camera"],
    images: [
      "https://sslphotos.jato.com/PHOT0408/SSCIND/VOLKSWAGEN/POLO/2015/4SA.JPG",
    ],
  },
];

async function main() {
  console.log("Starting seed...");

  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.subLocation.deleteMany();
  await prisma.city.deleteMany();

  console.log("Cleared existing data.");

  let carCounter = 1;

  for (const cityData of cities) {
    const city = await prisma.city.create({
      data: {
        name: cityData.name,
        state: cityData.state,
      },
    });

    console.log(`Created city: ${city.name}`);

    const citySublocations = subLocations[cityData.name] || [];

    for (const subData of citySublocations) {
      const sublocation = await prisma.subLocation.create({
        data: {
          name: subData.name,
          address: subData.address,
          latitude: subData.lat,
          longitude: subData.lng,
          cityId: city.id,
        },
      });

      const template1 = carTemplates[carCounter % carTemplates.length]!;
      const template2 = carTemplates[(carCounter + 1) % carTemplates.length]!;
      const template3 = carTemplates[(carCounter + 2) % carTemplates.length]!;
      const template4 = carTemplates[(carCounter + 3) % carTemplates.length]!;

      await prisma.car.createMany({
        data: [
          {
            ...template1,
            registrationNo: `KA${String(carCounter).padStart(5, "0")}`,
            subLocationId: sublocation.id,
          },
          {
            ...template2,
            registrationNo: `KA${String(carCounter + 1).padStart(5, "0")}`,
            subLocationId: sublocation.id,
          },
          {
            ...template3,
            registrationNo: `KA${String(carCounter + 2).padStart(5, "0")}`,
            subLocationId: sublocation.id,
          },
          {
            ...template4,
            registrationNo: `KA${String(carCounter + 3).padStart(5, "0")}`,
            subLocationId: sublocation.id,
          },
        ],
      });

      carCounter += 4;
    }

    console.log(`Created sublocations + cars for ${city.name}`);
  }

  const totalCities = await prisma.city.count();
  const totalSubs = await prisma.subLocation.count();
  const totalCars = await prisma.car.count();

  console.log("Seed complete!");
  console.log(`Cities: ${totalCities}`);
  console.log(`Sublocations: ${totalSubs}`);
  console.log(`Cars: ${totalCars}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect);
