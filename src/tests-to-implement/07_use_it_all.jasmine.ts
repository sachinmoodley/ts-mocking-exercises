import { InMemoryCache } from "../dependencies/InMemoryCache";
import { Item } from "../dependencies/Item";
import { ItemRepository } from "../dependencies/ItemRepository";
import { ItemProcessor } from "../tests-to-implement/07_use_it_all"
import { ItemTestDataBuilder } from "../testUtils/itemTestDataBuilder";
import { PubSub, PubSubChannels } from "./06_PubSub";

describe('ItemProcessor', () => {
  describe('processItems', () => {
    it('will not process items if processing is already busy', async () => {
      // Arrange
      spyOn(PubSub, 'getInstance').and
        .returnValue(jasmine.createSpyObj<PubSub>(['publish', 'subscribe']));

      const itemRepository = await createItemRepository([]);
      spyOn(itemRepository, 'getAll').and.returnValue(new Promise(() => { }));
      var sut = new ItemProcessor(new InMemoryCache(), itemRepository);
      // Act
      sut.processItems();
      sut.processItems();
      // Assert
      expect(itemRepository.getAll).toHaveBeenCalledTimes(1);
    })

    describe('given single unprocessed item', () => {
      it('updates the cache with the item', async () => {
        // Arrange
        spyOn(PubSub, 'getInstance').and
          .returnValue(jasmine.createSpyObj<PubSub>(['publish', 'subscribe']));
        const itemsList = [
          ItemTestDataBuilder.create().build(),
        ];
        const itemRepository = await createItemRepository(itemsList);
        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        // Assert
        expect(memoryCache.update).toHaveBeenCalledOnceWith(itemsList[0]);
      })

      it('publishes an item updated message', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const itemsList = [
          ItemTestDataBuilder.create().build(),
        ];
        const itemRepository = await createItemRepository(itemsList);
        const memoryCache = new InMemoryCache();
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        // Assert
        expect(pubSub.publish).toHaveBeenCalledOnceWith(PubSubChannels.itemUpdated, itemsList[0]);
      })

      it('does not process items that have already been processed', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const item1 = ItemTestDataBuilder.create().build();
        const item2 = ItemTestDataBuilder.create().build();
        const item3 = ItemTestDataBuilder.create().build();

        const itemRepository = await createItemRepository([item1, item2, item3]);
        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        await sut.processItems();
        // Assert
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item1);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item2);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item3);
        expect(pubSub.publish).toHaveBeenCalledTimes(3);
        expect(memoryCache.update).toHaveBeenCalledWith(item1);
        expect(memoryCache.update).toHaveBeenCalledWith(item2);
        expect(memoryCache.update).toHaveBeenCalledWith(item3);
        expect(memoryCache.update).toHaveBeenCalledTimes(3);
      })
    })

    describe('given newly added unprocessed items', () => {
      beforeEach(() => {
        jasmine.clock().install();
      })
      afterEach(() => {
        jasmine.clock().uninstall();
      })
      it('processes all newly added items every x seconds', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const item1 = ItemTestDataBuilder.create().build();
        const item2 = ItemTestDataBuilder.create().build();
        const item3 = ItemTestDataBuilder.create().build();

        const itemRepository = jasmine.createSpyObj<ItemRepository>(['insert', 'getAll']);
        itemRepository.getAll.and.returnValues([item1, item2], [item3]);

        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act + Assert
        await sut.processItems();

        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item1);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item2);
        expect(pubSub.publish).toHaveBeenCalledTimes(2);
        expect(memoryCache.update).toHaveBeenCalledWith(item1);
        expect(memoryCache.update).toHaveBeenCalledWith(item2);
        expect(memoryCache.update).toHaveBeenCalledTimes(2);
        jasmine.clock().tick(5000);

        await waitToNextMicroTask()

        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item3);
        expect(pubSub.publish).toHaveBeenCalledTimes(3);
        expect(memoryCache.update).toHaveBeenCalledWith(item3);
        expect(memoryCache.update).toHaveBeenCalledTimes(3);
      })
    })

    describe('given multiple unprocessed items', () => {
      beforeEach(() => {
        jasmine.clock().install();
      })
      afterEach(() => {
        jasmine.clock().uninstall();
      })
      it('updates the cache with the item', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const item1 = ItemTestDataBuilder.create().build();
        const item2 = ItemTestDataBuilder.create().build();
        const item3 = ItemTestDataBuilder.create().build();
        const item4 = ItemTestDataBuilder.create().build();
        const item5 = ItemTestDataBuilder.create().build();

        const itemRepository = jasmine.createSpyObj<ItemRepository>(['insert', 'getAll']);
        itemRepository.getAll.and.returnValues([item1, item2], [item3, item4, item5]);

        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        jasmine.clock().tick(5000);
        await waitToNextMicroTask()
        // Assert
        expect(memoryCache.update).toHaveBeenCalledWith(item3);
        expect(memoryCache.update).toHaveBeenCalledWith(item4);
        expect(memoryCache.update).toHaveBeenCalledWith(item5);
        expect(memoryCache.update).toHaveBeenCalledTimes(5);
      })

      it('publishes an item updated message', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const item1 = ItemTestDataBuilder.create().build();
        const item2 = ItemTestDataBuilder.create().build();
        const item3 = ItemTestDataBuilder.create().build();
        const item4 = ItemTestDataBuilder.create().build();
        const item5 = ItemTestDataBuilder.create().build();

        const itemRepository = jasmine.createSpyObj<ItemRepository>(['insert', 'getAll']);
        itemRepository.getAll.and.returnValues([item1, item2], [item3, item4, item5]);

        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        jasmine.clock().tick(5000);
        await waitToNextMicroTask()
        // Assert
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item3);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item4);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item5);
        expect(pubSub.publish).toHaveBeenCalledTimes(5);
      })

      it('does not process items that have already been processed', async () => {
        // Arrange
        const pubSub = jasmine.createSpyObj<PubSub>(['publish', 'subscribe']);
        spyOn(PubSub, 'getInstance').and
          .returnValue(pubSub);
        const item1 = ItemTestDataBuilder.create().build();
        const item2 = ItemTestDataBuilder.create().build();

        const itemRepository = jasmine.createSpyObj<ItemRepository>(['insert', 'getAll']);
        itemRepository.getAll.and.returnValues([item1, item2], [item2]);

        const memoryCache = new InMemoryCache();
        spyOn(memoryCache, 'update');
        var sut = new ItemProcessor(memoryCache, itemRepository);
        // Act
        await sut.processItems();
        jasmine.clock().tick(5000);
        await waitToNextMicroTask()
        // Assert
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item1);
        expect(pubSub.publish).toHaveBeenCalledWith(PubSubChannels.itemUpdated, item2);
        expect(pubSub.publish).toHaveBeenCalledTimes(2);
      })
    })
  })
})
function waitToNextMicroTask() {
  return new Promise((resolve, reject) => {
    queueMicrotask(() => {
      resolve('');
    });
  });
}

async function createItemRepository(items: Item[]): Promise<ItemRepository> {
  const itemRepository = new ItemRepository();
  await insertMultipleItems(items, itemRepository);
  return itemRepository;
}

async function insertMultipleItems(items: Item[], itemRepository: ItemRepository) {
  await items.forEach(async (item) => {
    await itemRepository.insert(item);
  });
}

