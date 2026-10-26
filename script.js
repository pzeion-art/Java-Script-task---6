


document.addEventListener("DOMContentLoaded", function () {

    const todayDate = document.getElementById("todayDate");
    const eventForm = document.getElementById("eventForm");
    const eventName = document.getElementById("eventName");
    const eventDate = document.getElementById("eventDate");
    const category = document.getElementById("category");
    const searchInput = document.getElementById("searchInput");
    const eventList = document.getElementById("eventList");
    const totalEvents = document.getElementById("totalEvents");
    const upcomingEvents = document.getElementById("upcomingEvents");
    const todayEvents = document.getElementById("todayEvents");

  
    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function showTodayDate() {
        todayDate.textContent = "Today: " +
            new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        eventDate.min = getTodayString();
    }

    showTodayDate();

    let events = [];

   
    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = eventName.value.trim();
        const date = eventDate.value;
        const selectedCategory = category.value;

        if (!name || !date) {
            alert("Please enter all event details.");
            return;
        }

        if (date < getTodayString()) {
            alert("Please select today or a future date.");
            return;
        }

        const newEvent = {
            id: Date.now(),
            name: name,
            date: date,
            category: selectedCategory
        };

        events.push(newEvent);

        eventForm.reset();
        eventDate.min = getTodayString();

        displayEvents();
    });

    function displayEvents() {
        const searchText = searchInput.value.toLowerCase().trim();

        const filteredEvents = events
            .filter(function (event) {
                return event.name.toLowerCase().includes(searchText) ||
                    event.category.toLowerCase().includes(searchText);
            })
            .sort(function (a, b) {
                return a.date.localeCompare(b.date);
            });

        eventList.innerHTML = "";

        if (filteredEvents.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-message";

            message.textContent = events.length === 0
                ? "No events added yet."
                : "No matching events found.";

            eventList.appendChild(message);
        }

        filteredEvents.forEach(function (event) {
            const card = document.createElement("div");
            card.className = "event";

            const title = document.createElement("h3");
            title.textContent = event.name;

            const dateText = document.createElement("p");
            dateText.textContent = "📅 Date: " +
                new Date(event.date + "T00:00:00")
                    .toLocaleDateString("en-IN");

            const categoryText = document.createElement("p");
            categoryText.textContent = "Category: " + event.category;

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                events = events.filter(function (item) {
                    return item.id !== event.id;
                });

                displayEvents();
            });

            card.append(title, dateText, categoryText, deleteButton);
            eventList.appendChild(card);
        });

        totalEvents.textContent = events.length;

        upcomingEvents.textContent = events.filter(function (event) {
            return event.date > getTodayString();
        }).length;

     
        todayEvents.textContent = events.filter(function (event) {
            return event.date === getTodayString();
        }).length;
    }

    
    searchInput.addEventListener("input", displayEvents);

   
    displayEvents();

});
