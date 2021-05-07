import { Item } from "../dependencies/Item"
import * as fakerStatic from "faker"

export class ItemTestDataBuilder {
  private price: number | null = null;

  static create() {
    return new ItemTestDataBuilder()
  }

  withPrice(value: number) {
    this.price = value
    return this;
  }

  build(): Item {
    return {
      id: fakerStatic.random.alphaNumeric(10),
      name: fakerStatic.random.words(),
      price: this.price ?? fakerStatic.finance.amount(),
      description: fakerStatic.random.words(),
      created: fakerStatic.date.future()
    } as unknown as Item
  }
}