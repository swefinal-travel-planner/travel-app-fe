import { handleApiResponse, safeBeApiCall } from '../lib/beApi'

describe('beApi Silent Error Handling', () => {
  describe('handleApiResponse', () => {
    it('should return null for silent error responses', () => {
      const silentResponse = { status: 401, data: null, silent: true, message: 'Auth failed' }
      const result = handleApiResponse(silentResponse)
      expect(result).toBeNull()
    })

    it('should return normal responses unchanged', () => {
      const normalResponse = { status: 200, data: { user: 'test' } }
      const result = handleApiResponse(normalResponse)
      expect(result).toEqual(normalResponse)
    })

    it('should return null for null/undefined responses', () => {
      expect(handleApiResponse(null)).toBeNull()
      expect(handleApiResponse(undefined)).toBeNull()
    })
  })

  describe('safeBeApiCall', () => {
    it('should handle successful API calls', async () => {
      const mockApiCall = jest.fn().mockResolvedValue({ status: 200, data: 'success' })

      const result = await safeBeApiCall(mockApiCall)

      expect(result).toEqual({ status: 200, data: 'success' })
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should handle silent error responses', async () => {
      const silentError = { status: 401, data: null, silent: true, message: 'Auth failed' }
      const mockApiCall = jest.fn().mockResolvedValue(silentError)

      const result = await safeBeApiCall(mockApiCall)

      expect(result).toBeNull()
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should re-throw non-silent errors', async () => {
      const regularError = new Error('Network error')
      const mockApiCall = jest.fn().mockRejectedValue(regularError)

      await expect(safeBeApiCall(mockApiCall)).rejects.toThrow('Network error')
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should handle silent errors thrown as exceptions', async () => {
      const silentError = { status: 401, data: null, silent: true, message: 'Auth failed' }
      const mockApiCall = jest.fn().mockRejectedValue(silentError)

      const result = await safeBeApiCall(mockApiCall)

      expect(result).toBeNull()
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })
  })
})
