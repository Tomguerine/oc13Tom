process.env.NODE_ENV = 'test'

jest.mock('../database/connection')
const dbConnection = require('../database/connection')
const app = require('../server')

describe('Server startup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('starts server after successful DB connection', async () => {
    dbConnection.mockResolvedValue()
    const listenMock = jest.spyOn(app, 'listen').mockImplementation((port, cb) => cb && cb())

    await app.startServer()

    expect(dbConnection).toHaveBeenCalled()
    expect(listenMock).toHaveBeenCalled()
  })

  test('does not start server if DB connection fails', async () => {
    const error = new Error('db fail')
    dbConnection.mockRejectedValue(error)
    const listenMock = jest.spyOn(app, 'listen').mockImplementation(() => {})
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {})
    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {})

    await app.startServer()

    expect(dbConnection).toHaveBeenCalled()
    expect(listenMock).not.toHaveBeenCalled()
    expect(exitMock).toHaveBeenCalledWith(1)
    expect(errorMock).toHaveBeenCalled()

    exitMock.mockRestore()
    errorMock.mockRestore()
  })
})
