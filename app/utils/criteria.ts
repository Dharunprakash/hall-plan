enum CriteriaTypes {
  GROUPING = "GROUPING",
  ORDER = "ORDER",
}

enum CriteriaCondition {
  AND = "AND",
  OR = "OR",
}

interface ICriteriaType {
  getName(): string
  getDisplayName(): string
  getTableName(): string
}

class GroupingCriteriaType implements ICriteriaType {
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

interface ICriteriaNode {
  getCriteriaType(): ICriteriaType
  getPriority(): number
}

class GroupingCriteriaNode implements ICriteriaNode {
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

interface ICriteriaBuilder {
  initialCriteria(criteria: ICriteriaNode): void
  and(criteria: ICriteriaNode): void
  or(criteria: ICriteriaNode): void
  build(): Readonly<ICriteria>
}

interface ICriteria {
  initialize(criteria: ICriteriaNode): void
  add(criteria: ICriteriaNode, condition: CriteriaCondition): void
}

class CriteriaBuilder implements ICriteriaBuilder {
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

class CriteriaFactory {
  public static createCriteria(criteriaType: CriteriaTypes): ICriteria {
    switch (criteriaType) {
      case CriteriaTypes.GROUPING:
        return new GroupingCriteria()
      case CriteriaTypes.ORDER:
        return new OrderCriteria()
    }
  }
}

class GroupingCriteria implements ICriteria {
  // This will be a class, where order of elements in array will determine the priority of criteria
  private criterias: GroupingCriteriaNode[] = []
  private conditions: CriteriaCondition[] = []

  constructor() {}

  initialize(criteriaNode: GroupingCriteriaNode): void {
    this.criterias = [criteriaNode]
  }

  add(criteriaNode: GroupingCriteriaNode, condition: CriteriaCondition): void {
    this.criterias.push(criteriaNode)
    this.conditions.push(condition)
  }
}

class OrderCriteriaNode implements ICriteriaNode {
  getCriteriaType(): ICriteriaType {
    throw new Error("Method not implemented.")
  }
  getPriority(): number {
    throw new Error("Method not implemented.")
  }
}

class OrderCriteria implements ICriteria {
  private criterias: OrderCriteriaNode[] = []
  private conditions: CriteriaCondition[] = []

  constructor() {}

  initialize(criteriaNode: OrderCriteriaNode): void {
    this.criterias = [criteriaNode]
  }

  add(criteriaNode: OrderCriteriaNode, condition: CriteriaCondition): void {
    this.criterias.push(criteriaNode)
    this.conditions.push(condition)
  }
}

// Strategy Pattern, responsible for how to process criteria and transform input, and it call is possible and moves to next criteria, NEED more clarity
interface ICriteriaProcessor {
  process(criteria: ICriteria): void
}

interface IGroupingCriteriaProcessor extends ICriteriaProcessor {
  process(criteria: GroupingCriteria): void
}

class GroupingCriteriaMustProcessor implements IGroupingCriteriaProcessor {
  process(criteria: GroupingCriteria): void {
    throw new Error("Method not implemented.")
  }
}

class GroupingCriteriaConditionalProcessor
  implements IGroupingCriteriaProcessor
{
  process(criteria: GroupingCriteria): void {
    throw new Error("Method not implemented.")
  }
}

class GroupingCriteriaOptionalProcessor implements IGroupingCriteriaProcessor {
  process(criteria: GroupingCriteria): void {
    throw new Error("Method not implemented.")
  }
}

// Criteria Enum, with details, and Criteria class which is provides a criteria objects with it's arragements of CriteriaEnum
// Where there will be a builder to the Criteria class, which will form criteria
// CriteriaArray is an array of CriteriaEnum
// CriteriaAPI is an interface which provides way to interact with Criteria class obj
