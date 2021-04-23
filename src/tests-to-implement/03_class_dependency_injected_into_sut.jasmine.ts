import { Item } from '../dependencies/Item'
import { PricingService } from '../dependencies/PricingService'
import { ItemPriceAdjuster } from '../tests-to-implement/03_class_dependency_injected_into_sut'

describe('ItemPriceAdjuster', () => {
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
      var pricingService = createPricingServiceWithMarkUp(expectedPercentage)
      const sut = createItemPriceAdjuster(pricingService)
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
      var pricingService = createPricingServiceWithMarkDown(expectedPercentage)
      const sut = createItemPriceAdjuster(pricingService)
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
      var expectedPercentage = 10; 
      var pricingService = createPricingServiceWithMarkDown(expectedPercentage)
      const sut = createItemPriceAdjuster(pricingService)
      // Act
      var adjustedItem = await sut.adjustPrice(item);
      // Assert
      expect(adjustedItem.price).toBe(100);
    })
  })
})

function createItemPriceAdjuster(pricingService: PricingService) {
  return new ItemPriceAdjuster(pricingService);
}

function createPricingServiceWithMarkUp(expectedPercentage: number) {
  var pricingService = jasmine.createSpyObj<PricingService>(['getMarkUpPercentage', 'getMarkDownPercentage'])
  pricingService.getMarkUpPercentage.and.returnValue(expectedPercentage)
  return pricingService
}

function createPricingServiceWithMarkDown(expectedPercentage: number) {
  var pricingService = jasmine.createSpyObj<PricingService>(['getMarkUpPercentage', 'getMarkDownPercentage'])
  pricingService.getMarkDownPercentage.and.returnValue(expectedPercentage)
  return pricingService
}

