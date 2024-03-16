import { db } from "@/lib/db"

const departments = [
  {
    name: "Computer Science and Engineering",
    code: "CSE",
  },
  {
    name: "Electronics and Communication Engineering",
    code: "ECE",
  },
  {
    name: "Electrical and Electronics Engineering",
    code: "EEE",
  },
  {
    name: "Mechanical Engineering",
    code: "MECH",
  },
  {
    name: "Civil Engineering",
    code: "CIVIL",
  },
  {
    name: "Information Technology",
    code: "IT",
  },
  {
    name: "Artificial Intelligence and Data Science",
    code: "AIDS",
  },
  {
    name: "Computer Science and Business Systems",
    code: "CSBS",
  },
  {
    name: "Biomedical Engineering",
    code: "BME",
  },
]

export const createDepartments = async () => {
  await db.department.createMany({
    data: departments,
  })
}

export const initializeCollegeDetails = async () => {
  await db.college.create({
    data: {
      name: "PSNA College of Engineering and Technology",
      description: "An Autonomous Institution affiliated to Anna University",
      code: "9213",
      aishe: "C-26783",
      address: "Kothandaraman Nagar, Dindigul, Tamil Nadu",
      district: "Dindigul",
      state: "Tamil Nadu",
      pincode: "624622",
      phone: "0451-2554400",
      email: "psna.psnacet.edu.in",
    },
  })
}
