const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testDataFile = path.join(__dirname, 'test-notifications.json');
let app;

beforeEach(() => {
	fs.writeFileSync(
		testDataFile,
		JSON.stringify({ notifications: [] }, null, 2),
	);
	process.env.DATA_FILE = testDataFile; 
	jest.resetModules();
	app = require('./index')
});

afterEach(() => {
	if (fs.existsSync(testDataFile)) {
		fs.unlinkSync(testDataFile);
	}
	delete process.env.DATA_FILE;
}); 

test('Retrieves an empty list of notifications', async () => {
	const res = await request(app).get('/api/notifications'); 
	expect(res.statusCode).toBe(200); 
	expect(res.body).toEqual([]);
});

test('Creates a notification', async () => {
	const res = await request(app).post('/api/notifications').send({ message: 'Test notification', type: 'success'});
	expect(res.statusCode).toBe(200);
	expect(res.body.message).toBe('Test notification'); 
	expect(res.body.type).toBe('success'); 
	expect(res.body).toHaveProperty('id'); 
	expect(res.body).toHaveProperty('timestamp')
});

test('Returns a notification that was created', async () => {
	const postRes = await request(app).post('/api/notifications').send({ message: 'Test notification', type: 'success'});

	expect(postRes.statusCode).toBe(200); 
	const getRes = await request(app).get('/api/notifications');
	expect(getRes.statusCode).toBe(200); 
	expect(getRes.body).toHaveLength(1); 
	expect(getRes.body[0].message).toBe('Test notification');
	expect(getRes.body[0].type).toBe('success'); 
	expect(getRes.body[0].id).toBe(postRes.body.id);
});

test('Deletes all notifications (DELETE)', async() => {
	await request(app).post('/api/notifications').send({ message: 'One', type: 'info' }); 
	const delRes = await request(app).delete('/api/notifications'); 
	expect(delRes.statusCode).toBe(200); 
	expect(delRes.body.success).toBe(true);

	const getRes = await request(app).get('/api/notifications'); 
	expect(getRes.body).toEqual([]);
});

