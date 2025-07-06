import { PlaceRepositoryProvider } from '../features/place/data/PlaceRepositoryProvider'
import { PlaceRepository } from '../features/place/domain/repositories/IPlaceRepository'
import { GetAllPlaces } from '../features/place/domain/usecases/GetAllPlaces'

describe('PlaceRepositoryProvider', () => {
  beforeEach(() => {
    // Reset the provider before each test
    PlaceRepositoryProvider.resetInstance()
  })

  afterEach(() => {
    // Clean up after each test
    PlaceRepositoryProvider.resetInstance()
  })

  it('should return the same instance when called multiple times', () => {
    const instance1 = PlaceRepositoryProvider.getInstance()
    const instance2 = PlaceRepositoryProvider.getInstance()

    expect(instance1).toBe(instance2)
  })

  it('should allow setting a custom implementation', () => {
    const mockRepo: PlaceRepository = {
      getPlaces: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Place', location: 'Test Location' }]),
    }

    PlaceRepositoryProvider.setInstance(mockRepo)
    const instance = PlaceRepositoryProvider.getInstance()

    expect(instance).toBe(mockRepo)
  })

  it('should work with use cases', async () => {
    const mockPlaces = [
      { id: '1', name: 'Test Place 1', location: 'Test Location 1' },
      { id: '2', name: 'Test Place 2', location: 'Test Location 2' },
    ]

    const mockRepo: PlaceRepository = {
      getPlaces: jest.fn().mockResolvedValue(mockPlaces),
    }

    PlaceRepositoryProvider.setInstance(mockRepo)
    const placeRepository = PlaceRepositoryProvider.getInstance()
    const getAllPlaces = new GetAllPlaces(placeRepository)

    const result = await getAllPlaces.execute({
      limit: 10,
      location: 'test',
      language: 'en',
    })

    expect(result).toEqual(mockPlaces)
    expect(mockRepo.getPlaces).toHaveBeenCalledWith({
      limit: 10,
      location: 'test',
      language: 'en',
    })
  })
})
