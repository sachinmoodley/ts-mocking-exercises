import { PubSub } from '../tests-to-implement/06_PubSub'

describe('PubSub', () => {
  describe('subscribe', () => {
    it('calls subscription callback when publish occurs on channel', async () => {
      // Arrange
      const sut = new PubSub();
      // Act     
      const callback = jasmine.createSpy();
      sut.subscribe('A', callback)
      await sut.publish('A', null);
      await waitForCallback(callback);

      // Assert
      expect(callback).toHaveBeenCalled();
    })

    it('calls all subscription callbacks when publish occurs on channel', async () => {
      // Arrange
      const sut = new PubSub();
      // Act     
      const callback = jasmine.createSpy();
      const callback2 = jasmine.createSpy();
      sut.subscribe('A', callback);
      sut.subscribe('A', callback2);
      const p = waitForCallback(callback); 
      const p2 = waitForCallback(callback2);
      await sut.publish('A', null);
      await p;
      await p2;

      // Assert
      expect(callback).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    })
  })
})
function waitForCallback(callback: jasmine.Spy<jasmine.Func>) {
  return new Promise((resolve, reject) => {
    callback.and.callFake(() => { resolve(null); });
  });
}

