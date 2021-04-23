import { Item } from '../dependencies/Item'
import { PricingService } from '../dependencies/PricingService'
import { ItemPriceAdjusterVersion2 } from '../tests-to-implement/04_class_dependency_initialized_within_sut'

describe('ItemPriceAdjusterVersion2', () => {
  describe('price is less than 100', () => {
    it('marks item price up by the markup percentage', async () => {
      // Arrange
      var item = {
        id: '1',
        name: 'Cake',
        price: 99,
        description: 'Choc',
        created: new Date()
      } as Item
      var expectedPercentage = 10; 
      overrideMarkupPercentage(expectedPercentage)
      
      const sut = createItemPriceAdjuster()
      // Act
      var adjustedItem = await sut.adjustPrice(item);
      // Assert
      expect(adjustedItem.price).toBe(108.9);
    })
  })

  describe('price is greater than 100', () => {
    it('marks item price down by the markdown percentage', async () => {
      // Arrange
        var item = {
          id: '1',
          name: 'Cake',
          price: 110,
          description: 'Choc',
          created: new Date()
      } as Item
      var expectedPercentage = 10; 
      overrideMarkDownPercentage(expectedPercentage)
      const sut = createItemPriceAdjuster()
      // Act
      var adjustedItem = await sut.adjustPrice(item);
      // Assert
      expect(adjustedItem.price).toBe(99);
    })
  })

  describe('price is equal to 100', () => {
    it('will not alter the price', async () => {
       // Arrange
       var item = {
        id: '1',
        name: 'Cake',
        price: 100,
        description: 'Choc',
        created: new Date()
      } as Item
      const sut = createItemPriceAdjuster()
      // Act
      var adjustedItem = await sut.adjustPrice(item);
      // Assert
      expect(adjustedItem.price).toBe(100);
    })
  })
})

function createItemPriceAdjuster() {
  return new ItemPriceAdjusterVersion2();
}

function overrideMarkupPercentage(expectedPercentage: number) {
  spyOn(PricingService.prototype, 'getMarkUpPercentage').and.returnValue(expectedPercentage);
}

function overrideMarkDownPercentage(expectedPercentage: number) {
  spyOn(PricingService.prototype, 'getMarkDownPercentage').and.returnValue(expectedPercentage);

}
