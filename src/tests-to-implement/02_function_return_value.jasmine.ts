import { getAllItemsOnSale } from '../tests-to-implement/02_function_return_value'
import * as CakeIsYummy from '../dependencies/get_all'

describe('function mock return value', () => {
  describe('getAllItemsOnSale', () => {
    fit('returns only prices under 10', async () => {
      // Arrange
      const items = [
        {
          id: '1',
          name: 'Cake',
          price: 9,
          description: 'Choc',
          created: new Date()
        },
        {
          id: '2',
          name: 'Cake',
          price: 10,
          description: 'Vanilla',
          created: new Date()
        },
        {
          id: '3',
          name: 'Cake',
          price: 11,
          description: 'Strawberry',
          created: new Date()
        }
      ]
      spyOn(CakeIsYummy, 'getAll').and.returnValue(items)
      // Act
      const sut = await getAllItemsOnSale();
      // Assert
      expect(sut[0]).toEqual(items[0]);
      expect(sut.length).toEqual(1);
    })
  })
})
