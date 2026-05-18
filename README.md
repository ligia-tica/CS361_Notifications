# CS361_Notifications
A lightweight REST API microservice for managing notifications. Supports adding, retrieving, and clearing notifications.

## Base URL
http://localhost:3002

## Endpoints
POST - add a notification
```
http://localhost:3002/api/notifications
``` 
GET  — get all notifications
```
http://localhost:3002/api/notifications
```
DELETE  — clear all notifications
```
http://localhost:3002/api/notifications
```

## Notification Types

| Type | When to use |
|------|-------------|
| success | Action completed successfully |
| error | Something went wrong |
| warning | User should be aware of something |
| info | General information |

## Requesting and receiving data

### Creating a notification

Request:
```http
POST /api/notifications
```

Body:

```json
{ 
	"message": "your message", 
	"type": "success | error | warning | info"
}
```

Example:
```javascript
async function createNotification() {
    const res = await fetch('http://localhost:3002/api/notifications', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        message: 'Profile saved succesfully', 
        type: 'info'
      })
    });
    const data = await res.json(); 
    console.log(data)
}
```

Data received

```json
[
	{
		"id": 1779067121404,
		"message": "Profile saved succesfully",
		"type": "info",
		"timestamp": "2026-05-18T01:18:41.404Z"
	}
]
```



### Get all notifications

Request:

```http
GET /api/notifications
```

Example:

```javascript
async function getNotifications() {
	const res = await fetch('http://localhost:3002/api/notifications');
	const data = await res.json();
	console.log(data)
}
```

Data received:

```json
[
	{
		"id": 1779067921144,
		"message": "Password updated successfully",
		"type": "info",
		"timestamp": "2026-05-18T01:32:01.144Z"
	},
	{
		"id": 1779067121404,
		"message": "Profile saved succesfully",
		"type": "info",
		"timestamp": "2026-05-18T01:18:41.404Z"
	}
]
```


### Clear all notifications

Request:

```http
DELETE /api/notifications
```

Example:

```javascript
async function deleteNotifications() {
	const res = await fetch('http://localhost:3002/api/notifications', {
		method: 'DELETE'
	}); 
	const data = await res.json()
	console.log(data)
}
```

Data received:

```javascript
{ success: true, message: "All notifications cleared" }
```

## UML Sequence Diagram

![UML Sequence Diagram for notifications REST API](./assets/uml-diagram.png)
