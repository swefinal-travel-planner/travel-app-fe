import { handleCoreApiResponse, safeCoreApiCall } from '../lib/coreApi'

describe('coreApi Silent Error Handling', () => {
  describe('handleCoreApiResponse', () => {
    it('should return null for silent error responses', () => {
      const silentResponse = { status: 401, data: null, silent: true, message: 'Core API auth failed' }
      const result = handleCoreApiResponse(silentResponse)
      expect(result).toBeNull()
    })

    it('should return normal responses unchanged', () => {
      const normalResponse = { status: 200, data: { places: [] } }
      const result = handleCoreApiResponse(normalResponse)
      expect(result).toEqual(normalResponse)
    })

    it('should return null for null/undefined responses', () => {
      expect(handleCoreApiResponse(null)).toBeNull()
      expect(handleCoreApiResponse(undefined)).toBeNull()
    })
  })

  describe('safeCoreApiCall', () => {
    it('should handle successful API calls', async () => {
      const mockApiCall = jest.fn().mockResolvedValue({ status: 200, data: 'success' })

      const result = await safeCoreApiCall(mockApiCall)

      expect(result).toEqual({ status: 200, data: 'success' })
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should handle silent error responses', async () => {
      const silentError = { status: 401, data: null, silent: true, message: 'Core API auth failed' }
      const mockApiCall = jest.fn().mockResolvedValue(silentError)

      const result = await safeCoreApiCall(mockApiCall)

      expect(result).toBeNull()
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should re-throw non-silent errors', async () => {
      const regularError = new Error('Network error')
      const mockApiCall = jest.fn().mockRejectedValue(regularError)

      await expect(safeCoreApiCall(mockApiCall)).rejects.toThrow('Network error')
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should handle silent errors thrown as exceptions', async () => {
      const silentError = { status: 401, data: null, silent: true, message: 'Core API auth failed' }
      const mockApiCall = jest.fn().mockRejectedValue(silentError)

      const result = await safeCoreApiCall(mockApiCall)

      expect(result).toBeNull()
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })
  })
})
