import { PlaceRepository } from '../domain/repositories/IPlaceRepository'
import { PlaceRepoImpl } from './PlaceRepoImpl'

export class PlaceRepositoryProvider {
  private static instance: PlaceRepository

  public static getInstance(): PlaceRepository {
    if (!PlaceRepositoryProvider.instance) {
      PlaceRepositoryProvider.instance = new PlaceRepoImpl()
    }
    return PlaceRepositoryProvider.instance
  }

  // For testability or swapping implementations
  public static setInstance(repo: PlaceRepository): void {
    PlaceRepositoryProvider.instance = repo
  }

  // Reset instance for testing
  public static resetInstance(): void {
    PlaceRepositoryProvider.instance = undefined as any
  }
}

/*
Usage Examples:

1. Default usage (in components/hooks):
   const placeRepository = PlaceRepositoryProvider.getInstance();
   const getAllPlaces = new GetAllPlaces(placeRepository);

2. For testing with mock:
   const mockRepo = {
     getPlaces: jest.fn().mockResolvedValue([])
   };
   PlaceRepositoryProvider.setInstance(mockRepo);

3. For testing cleanup:
   PlaceRepositoryProvider.resetInstance();

4. For swapping implementations:
   PlaceRepositoryProvider.setInstance(new CustomPlaceRepoImpl());
*/
