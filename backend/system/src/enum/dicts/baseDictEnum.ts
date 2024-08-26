export abstract class BaseDictEnum<T> {

  protected constructor(private readonly key: string, public readonly code: string, public readonly value: T, public readonly label?: string) {

  }

  public toString() {
    return this.key;
  }

}
