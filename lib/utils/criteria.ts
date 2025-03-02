import { StudentWithDept } from "@/types/student"

import { GroupedStudent, GroupingKey } from "./GroupedStudent"

export enum CriteriaTypes {
  GROUPING = "GROUPING",
  ORDER = "ORDER",
}

export enum CriteriaCondition {
  AND = "AND",
  OR = "OR",
}

export interface ICriteriaType {
  getName(): string
  getDisplayName(): string
  getTableName(): string
}

export class GroupingCriteriaType implements ICriteriaType {
  static SUBJECT = new GroupingCriteriaType("subject", "Subject", "subjects")
  static YEAR = new GroupingCriteriaType("year", "Year", "years")
  static DEPARTMENT = new GroupingCriteriaType(
    "department",
    "Department",
    "departments"
  )
  static SECTION = new GroupingCriteriaType("section", "Section", "sections")

  private constructor(
    public name: string,
    public displayName: string,
    public tableName: string
  ) {}
  getName(): string {
    return this.name
  }
  getDisplayName(): string {
    return this.displayName
  }
  getTableName(): string {
    return this.tableName
  }

  static values() {
    return [
      GroupingCriteriaType.SUBJECT,
      GroupingCriteriaType.YEAR,
      GroupingCriteriaType.DEPARTMENT,
      GroupingCriteriaType.SECTION,
    ]
  }
}

export class OrderCriteriaType implements ICriteriaType {
  static NAME = new OrderCriteriaType("name", "Name", "names")
  static ROLLNO = new OrderCriteriaType("rollno", "Roll No", "rollnos")
  static YEAR = new OrderCriteriaType("year", "Year", "years")
  static SECTION = new OrderCriteriaType("section", "Section", "sections")
  static DEPARTMENT = new OrderCriteriaType(
    "department",
    "Department",
    "departments"
  )
  static REGNO = new OrderCriteriaType("regno", "Reg No", "regnos")

  private constructor(
    public name: string,
    public displayName: string,
    public tableName: string
  ) {}
  getName(): string {
    return this.name
  }
  getDisplayName(): string {
    return this.displayName
  }
  getTableName(): string {
    return this.tableName
  }

  static values() {
    return [OrderCriteriaType.NAME]
  }
}

export interface ICriteriaNode {
  getCriteriaType(): ICriteriaType
  getPriority(): number
}

export class GroupingCriteriaNode implements ICriteriaNode {
  private criteriaType: GroupingCriteriaType
  private priority: number

  constructor(criteriaType: GroupingCriteriaType, priority: number) {
    this.criteriaType = criteriaType
    this.priority = priority
  }

  getCriteriaType(): ICriteriaType {
    return this.criteriaType
  }

  getPriority(): number {
    return this.priority
  }
}

export interface ICriteriaBuilder {
  initialCriteria(criteria: ICriteriaNode): void
  and(criteria: ICriteriaNode): void
  or(criteria: ICriteriaNode): void
  build(): Readonly<ICriteria>
}

export interface ICriteria {
  initialize(criteria: ICriteriaNode): void
  add(criteria: ICriteriaNode, condition: CriteriaCondition): void
  getCriteria(): ICriteriaNode[]
}

export class CriteriaBuilder implements ICriteriaBuilder {
  private criteria: ICriteria

  constructor(criteria: ICriteria) {
    this.criteria = criteria
  }

  // from factory
  static createBuilder(criteria: ICriteria): CriteriaBuilder {
    return new CriteriaBuilder(criteria)
  }

  initialCriteria(criteria: ICriteriaNode): CriteriaBuilder {
    this.criteria.initialize(criteria)
    return this
  }

  and(criteria: ICriteriaNode): CriteriaBuilder {
    this.criteria.add(criteria, CriteriaCondition.AND)
    return this
  }

  or(criteria: ICriteriaNode): CriteriaBuilder {
    this.criteria.add(criteria, CriteriaCondition.OR)
    return this
  }

  build(): Readonly<ICriteria> {
    return Object.freeze(this.criteria)
  }
}

export class CriteriaFactory {
  public static createCriteria(criteriaType: CriteriaTypes): ICriteria {
    switch (criteriaType) {
      case CriteriaTypes.GROUPING:
        return new GroupingCriteria()
      case CriteriaTypes.ORDER:
        return new OrderCriteria()
    }
  }
}

export class GroupingCriteria implements ICriteria {
  // This will be a class, where order of elements in array will determine the priority of criteria
  private criterias: GroupingCriteriaNode[] = []
  private conditions: CriteriaCondition[] = []

  constructor(node?: GroupingCriteriaNode) {
    if (node) this.criterias = [node]
  }

  initialize(criteriaNode: GroupingCriteriaNode): void {
    this.criterias = [criteriaNode]
  }

  add(criteriaNode: GroupingCriteriaNode, condition: CriteriaCondition): void {
    this.criterias.push(criteriaNode)
    this.conditions.push(condition)
  }

  getCriteria(): GroupingCriteriaNode[] {
    return this.criterias
  }
}

export class OrderCriteriaNode implements ICriteriaNode {
  private criteriaType: OrderCriteriaType
  private priority: number

  constructor(criteriaType: OrderCriteriaType, priority: number) {
    this.criteriaType = criteriaType
    this.priority = priority
  }

  getCriteriaType(): ICriteriaType {
    return this.criteriaType
  }

  getPriority(): number {
    return this.priority
  }
}

export class OrderCriteria implements ICriteria {
  private criterias: OrderCriteriaNode[] = []
  private conditions: CriteriaCondition[] = []

  constructor(node?: OrderCriteriaNode) {
    if (node) this.criterias = [node]
  }

  initialize(criteriaNode: OrderCriteriaNode): void {
    this.criterias = [criteriaNode]
  }

  add(criteriaNode: OrderCriteriaNode, condition: CriteriaCondition): void {
    this.criterias.push(criteriaNode)
    this.conditions.push(condition)
  }

  getCriteria(): OrderCriteriaNode[] {
    return this.criterias
  }
}

// Strategy Pattern, responsible for how to process criteria and transform input, and it call is possible and moves to next criteria, NEED more clarity

export interface IGroupingCriteriaProcessor {
  group(students: StudentWithDept[]): GroupedStudent[]
}

export interface IOrderCriteriaProcessor {
  order(students: StudentWithDept[]): StudentWithDept[]
}

// only 1st
export class GroupingCriteriaMustProcessor
  implements IGroupingCriteriaProcessor
{
  group(students: StudentWithDept[]): GroupedStudent[] {
    throw new Error("Method not implemented.")
  }
  process(criteria: GroupingCriteria): void {
    throw new Error("Method not implemented.")
  }
}

export class StudentUtils {
  static formKey(
    students: StudentWithDept[],
    criteriaList: GroupingCriteriaNode[]
  ): GroupingKey {
    const key: GroupingKey = {}
    criteriaList.forEach((criteria) => {
      const criteriaType = criteria.getCriteriaType()
      const keyName = criteriaType.getName()
      const priority = criteria.getPriority()
      students.forEach((student) => {
        switch (keyName) {
          case "department":
            key.department = student.department
            break
          case "year":
            key.year = student.year
            break
          case "section":
            key.section = student.section
            break
          case "subject":
            throw new Error("Not implemented")
          default:
            throw new Error(`Unknown key name: ${keyName}`)
        }
      })
    })
    return key
  }

  static getOrderKey(student: StudentWithDept, key: OrderCriteriaType): any {
    switch (key.getName()) {
      case "name":
        return student.name
      case "rollno":
        return student.rollno
      case "year":
        return student.year
      case "section":
        return student.section
      case "department":
        return student.department
      case "regno":
        return student.regno
      default:
        throw new Error(`Unknown key name: ${key.getName()}`)
    }
  }
}

// Only OR
export class GroupingCriteriaConditionalProcessor
  implements IGroupingCriteriaProcessor
{
  private criteria: GroupingCriteria

  constructor(criteria: ICriteria) {
    this.criteria = criteria as GroupingCriteria
  }

  group(students: StudentWithDept[]): GroupedStudent[] {
    const criteriaList = this.criteria.getCriteria()
    const grouped: Record<string, StudentWithDept[]> = {}

    students.forEach((student) => {
      const keyObj: GroupingKey = StudentUtils.formKey(students, criteriaList)
      const key = JSON.stringify(keyObj)
      grouped[key] = grouped[key] || []
      grouped[key].push(student)
    })

    return Object.entries(grouped).map(
      ([key, students]) =>
        new GroupedStudent(JSON.parse(key) as GroupingKey, students)
    )
  }
}

export class OrderCriteriaProcessor implements IOrderCriteriaProcessor {
  private criteria: OrderCriteria

  constructor(criteria: ICriteria) {
    this.criteria = criteria as OrderCriteria
  }

  order(students: StudentWithDept[]): StudentWithDept[] {
    // sort students based on criteriaList
    let criteriaList = this.criteria.getCriteria()
    return students.sort((a, b) => {
      for (let i = 0; i < criteriaList.length; i++) {
        const criteria = criteriaList[i]
        // Delegate this responsibility to OrderCriteriaEnum export class as static method or method
        const criteriaType = criteria.getCriteriaType() as OrderCriteriaType
        const aKey = StudentUtils.getOrderKey(a, criteriaType)
        const bKey = StudentUtils.getOrderKey(b, criteriaType)
        if (aKey < bKey) return -1
        if (aKey > bKey) return 1
      }
      return 0
    })
  }
}

// Criteria Enum, with details, and Criteria class which is provides a criteria objects with it's arragements of CriteriaEnum
// Where there will be a builder to the Criteria class, which will form criteria
// CriteriaArray is an array of CriteriaEnum
// CriteriaAPI is an interface which provides way to interact with Criteria class obj
