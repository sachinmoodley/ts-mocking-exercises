
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
    var currentDate = new Date();
    var time = getTimeFor(currentDate);
    var day = getDayName(currentDate);

    jasmine.clock().mockDate(currentDate)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is ${day}`;
    // Assert
    expect(message).toBe(expected)

  })

  it('returns a message containing the current time after some time has elapsed', () => {
    // Arrange
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    var time = getTimeFor(currentDate);
    var day = getDayName(currentDate);
    jasmine.clock().mockDate(currentDate)

    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is ${day}`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Monday" on Mondays', () => {
    // Arrange
    var date = new Date("2021-04-19");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Monday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Tuesday" on Tuesdays', () => {
    // Arrange
    var date = new Date("2021-04-20");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Tuesday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Wednesday" on Wednesdays', () => {
    // Arrange
    var date = new Date("2021-04-21");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Wednesday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Thursday" on Thursdays', () => {
    // Arrange
    var date = new Date("2021-04-22");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Thursday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Friday" on Fridays', () => {
    // Arrange
    var date = new Date("2021-04-23");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Friday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Saturday" on Saturdays', () => {
    // Arrange
    var date = new Date("2021-04-24");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)
    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Saturday`;
    // Assert
    expect(message).toBe(expected)
  })

  it('returns a message containing "Sunday" on Sundays', () => {
    // Arrange
    var date = new Date("2021-04-25");
    var time = getTimeFor(date);
    jasmine.clock().mockDate(date)

    // Act
    var message = generateDayMessage();

    var expected = `[${time}]: Today is Sunday`;
    // Assert
    expect(message).toBe(expected)
  })
})

function getDayName(currentDate: Date) {
  return currentDate.toLocaleDateString("en-za", { weekday: 'long' });
}

function getTimeFor(date: Date) {
  return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
}

