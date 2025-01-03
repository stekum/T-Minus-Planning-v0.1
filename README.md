# T-Minus Planner

T-Minus Planner is a visual project management tool that helps teams track tasks against a target date using a T-minus countdown system. It provides a clear overview of tasks, deadlines, and team responsibilities.

## Features

- **Visual Timeline**: Displays tasks in a timeline format with T-minus countdown.
- **Team-Based Swimlanes**: Organizes tasks by team members for better visibility.
- **Editable Project Title**: Click to edit the project title inline.
- **Task Management**: Add, edit, and delete tasks easily.
- **Progress Tracking**: Visual representation of progress towards the target date.
- **Configuration Options**: Customize team members, target date, and display settings.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd t-minus-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

### Adding Tasks

1. Enter the task details in the input form:
   - **Task Name**: Required field.
   - **Subtitle**: Optional field.
   - **Due Date**: Required field (select a date and time).
   - **Team Member**: Select from the dropdown.

2. Click the **Add Task** button to create the task.

### Timeline Navigation

- The timeline shows dates across the top and T-minus countdown values.
- Tasks are positioned according to their due dates.

### Task Management

- **Edit Task**: Click the edit icon to modify task details.
- **Delete Task**: Click the delete icon to remove a task.

### Project Title

- Click on the project title to edit it.
- Press **Enter** to save or **Escape** to cancel.

### Configuration

1. Click the **Configure Plan** button to open the configuration modal.
2. Adjust the following settings:
   - **Project Title**: Change the name of your plan.
   - **Target Date**: Set the end date for your timeline.
   - **Team Members**: Add or remove team members.
   - **Display Settings**: Choose color themes and toggle weekend visibility.

3. Click **Save Configuration** to apply changes.

## Technical Details

### Built With

- **React**: JavaScript library for building user interfaces.
- **date-fns**: Library for date manipulation.
- **react-circular-progressbar**: For displaying progress visually.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Project Structure

```
src/
├── App.jsx          # Main application component
├── components/
│   ├── ConfigModal.jsx  # Configuration modal component
├── index.css        # Global styles and Tailwind imports
└── main.jsx         # Application entry point
```

### Components

- **App**: Main container component managing the application state and layout.
- **EditableTitle**: Allows inline editing of the project title.
- **TaskForm**: Handles task creation with input validation.
- **Timeline**: Displays the date-based timeline with T-minus countdown.
- **Swimlane**: Organizes tasks by team member in horizontal lanes.

## State Management

The application manages several pieces of state:
- **Tasks**: Array of task objects.
- **Target Date**: The end date for the project.
- **Project Title**: The name of the project.
- **Team Members**: List of team members involved in the project.

## Styling

The project uses Tailwind CSS for styling with:
- Responsive grid layout
- Consistent spacing
- Modern UI components
- Hover effects
- Clean typography

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the contributors and the open-source community for their support.
