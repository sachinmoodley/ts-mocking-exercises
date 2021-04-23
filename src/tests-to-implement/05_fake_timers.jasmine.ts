import { generateDayMessage } from '../tests-to-implement/05_fake_timers'

describe('generateDayMessage', () => {
  beforeEach(() => {
    jasmine.clock().install();
  })

  afterEach(() => {
    jasmine.clock().uninstall();
  })
  
  it('returns a message containing the current time', () => {
    // Arrange

    jasmine.clock().mockDate(new Date("2021-04-23T11:11:11"))
    // Act
    var message = generateDayMessage();

    // Assert
    expect(message).toBe("[11:11:11 AM]: Today is Friday")

  })

  xit('returns a message containing the current time after some time has elapsed', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Monday" on Mondays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Tuesday" on Tuesdays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Wednesday" on Wednesdays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Thursday" on Thursdays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Friday" on Fridays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Saturday" on Saturdays', () => {
    // Arrange
    // Act
    // Assert
  })

  xit('returns a message containing "Sunday" on Sundays', () => {
    // Arrange
    // Act
    // Assert
  })
})
