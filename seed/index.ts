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

export const fillSeats = async () => {
  const students = await db.student.findMany({
    take: 120,
    orderBy: [
      {
        section: "asc",
      },
      {
        rollno: "asc",
      },
    ],
  })
  console.log(students)
  const updateSeat = await db.seat.findMany({
    take: 120,
    orderBy: [
      {
        hall: {
          department: {
            code: "asc",
          },
        },
      },
      {
        hall: {
          hallno: "asc",
        },
      },
      { row: "asc" },
      { col: "asc" },
    ],
  })
  console.log(updateSeat)
  const promises = students.map((student, i) => {
    return db.seat.update({
      where: {
        id: updateSeat[i].id,
      },
      data: {
        student: {
          connect: {
            id: student.id,
          },
        },
        year: student.year,
        semester: student.semester,
      },
    })
  })
  await Promise.all(promises)
  console.log("Seats filled")
  throw new Error("Seeds are not implemented")
}
