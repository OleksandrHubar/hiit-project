// Тести для функцій workout.js

describe('Workout Functions', () => {
    // Тести для валідації даних
    describe('validateData', () => {
        test('має валідувати коректні дані учасника', () => {
            const participant = {
                name: 'John',
                calories: 100,
                gender: 'male'
            };
            expect(validateData(participant)).toBe(true);
        });

        test('має відхиляти неправильні дані учасника', () => {
            const invalidParticipant = {
                name: 123, // Неправильний тип
                calories: 'invalid', // Неправильний тип
                gender: 'invalid' // Неправильне значення
            };
            expect(validateData(invalidParticipant)).toBe(false);
        });

        test('має перевіряти межі калорій', () => {
            const participant = {
                name: 'John',
                calories: 10000, // Занадто багато калорій
                gender: 'male'
            };
            expect(validateData(participant)).toBe(false);
        });
    });

    // Тести для роботи з localStorage
    describe('localStorage Operations', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        test('safeSaveToStorage має зберігати дані', () => {
            const data = { test: 'data' };
            expect(safeSaveToStorage('testKey', data)).toBe(true);
            expect(JSON.parse(localStorage.getItem('testKey'))).toEqual(data);
        });

        test('safeGetFromStorage має отримувати дані', () => {
            const data = { test: 'data' };
            localStorage.setItem('testKey', JSON.stringify(data));
            expect(safeGetFromStorage('testKey')).toEqual(data);
        });

        test('safeGetFromStorage має повертати null для неіснуючих даних', () => {
            expect(safeGetFromStorage('nonExistentKey')).toBeNull();
        });
    });

    // Тести для обчислення калорій
    describe('Calories Calculation', () => {
        test('має правильно обчислювати калорії для чоловіків', () => {
            const participant = {
                name: 'John',
                calories: 100,
                gender: 'male'
            };
            const exercise = {
                name: 'Push-ups',
                calories: 10
            };
            const calories = calculateCalories(participant, exercise, 10);
            expect(calories).toBe(100); // 10 * 10
        });

        test('має правильно обчислювати калорії для жінок', () => {
            const participant = {
                name: 'Jane',
                calories: 100,
                gender: 'female'
            };
            const exercise = {
                name: 'Push-ups',
                calories: 10
            };
            const calories = calculateCalories(participant, exercise, 10);
            expect(calories).toBe(80); // 10 * 10 * 0.8
        });
    });

    // Тести для валідації повторень
    describe('Repetitions Validation', () => {
        test('має приймати валідну кількість повторень', () => {
            expect(validateRepetitions(10)).toBe(true);
            expect(validateRepetitions(1)).toBe(true);
            expect(validateRepetitions(1000)).toBe(true);
        });

        test('має відхиляти невалідну кількість повторень', () => {
            expect(validateRepetitions(0)).toBe(false);
            expect(validateRepetitions(-1)).toBe(false);
            expect(validateRepetitions(1001)).toBe(false);
            expect(validateRepetitions('invalid')).toBe(false);
        });
    });

    // Тести для оновлення статистики
    describe('Statistics Update', () => {
        test('має правильно оновлювати статистику учасника', () => {
            const participant = {
                name: 'John',
                calories: 0,
                exercises: []
            };
            const exercise = {
                name: 'Push-ups',
                calories: 10
            };
            updateParticipantStats(participant, exercise, 10);
            expect(participant.calories).toBe(100);
            expect(participant.exercises.length).toBe(1);
            expect(participant.exercises[0].name).toBe('Push-ups');
            expect(participant.exercises[0].reps).toBe(10);
        });
    });
}); 