document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const subjectsTable = document.getElementById('subjects-tbody');
    const addSubjectBtn = document.getElementById('add-subject');
    const addSubjectModal = document.getElementById('add-subject-modal');
    const addSubjectForm = document.getElementById('add-subject-form');
    const editSubjectModal = document.getElementById('edit-subject-modal');
    const editSubjectForm = document.getElementById('edit-subject-form');
    const deleteSubjectBtn = document.getElementById('delete-subject-btn');
    const semesterSelect = document.getElementById('semester-select');
    const importBtn = document.getElementById('import-data');
    const exportBtn = document.getElementById('export-data');
    const importModal = document.getElementById('import-modal');
    const uploadJsonBtn = document.getElementById('upload-json');
    const loadSampleBtn = document.getElementById('load-sample');
    const forecastBtn = document.getElementById('calculate-forecast');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // GPA Elements
    const currentGpaEl = document.getElementById('current-gpa');
    const targetGpaEl = document.getElementById('target-gpa');
    const totalCreditsEl = document.getElementById('total-credits');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressFillEl = document.getElementById('gpa-progress-fill');
    const projectedGpaEl = document.getElementById('projected-gpa');

    // Chart
    let gpaTrendsChart;

    // Initialize
    let subjects = [];
    let targetGPA = 4.0;

    // Load data from storage
    function loadData() {
        const savedData = localStorage.getItem('gpaData');
        if (savedData) {
            const data = JSON.parse(savedData);
            subjects = data.subjects || [];
            targetGPA = data.targetGPA || 4.0;
        }
        updateUI();
    }

    // Save data to storage
    function saveData() {
        const data = {
            subjects,
            targetGPA
        };
        localStorage.setItem('gpaData', JSON.stringify(data));
    }

    // Calculate current GPA
    function calculateGPA() {
        if (subjects.length === 0) return 0;

        let totalPoints = 0;
        let totalCredits = 0;

        subjects.forEach(subject => {
            totalPoints += subject.grade * subject.credits;
            totalCredits += subject.credits;
        });

        return totalCredits > 0 ? totalPoints / totalCredits : 0;
    }

    // Update all UI elements
    function updateUI() {
        // Update GPA display
        const currentGPA = calculateGPA();
        currentGpaEl.textContent = currentGPA.toFixed(2);
        targetGpaEl.textContent = targetGPA.toFixed(2);

        // Update credits
        const credits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
        totalCreditsEl.textContent = credits;

        // Update progress
        const progressPercent = Math.min(Math.floor((currentGPA / targetGPA) * 100), 100);
        progressPercentEl.textContent = `${progressPercent}%`;
        progressFillEl.style.width = `${progressPercent}%`;

        // Update subjects table
        renderSubjectsTable();

        // Update chart
        updateChart();
    }

    // Render subjects table
    function renderSubjectsTable() {
        const semesterFilter = semesterSelect.value;
        const filteredSubjects = semesterFilter === 'all'
            ? subjects
            : subjects.filter(subject => subject.semester === semesterFilter);

        subjectsTable.innerHTML = '';

        if (filteredSubjects.length === 0) {
            subjectsTable.innerHTML = `
                <tr class="empty-state">
                    <td colspan="5">No subjects found. Add some subjects to get started.</td>
                </tr>
            `;
            return;
        }

        filteredSubjects.forEach((subject, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>${subject.credits}</td>
                <td>${gradeToLetter(subject.grade)} (${subject.grade.toFixed(1)})</td>
                <td>Semester ${subject.semester}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            subjectsTable.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteSubject(parseInt(btn.dataset.id)));
        });
    }

    // Convert grade points to letter grade
    function gradeToLetter(grade) {
        if (grade >= 4.0) return 'A';
        if (grade >= 3.7) return 'A-';
        if (grade >= 3.3) return 'B+';
        if (grade >= 3.0) return 'B';
        if (grade >= 2.7) return 'B-';
        if (grade >= 2.3) return 'C+';
        if (grade >= 2.0) return 'C';
        if (grade >= 1.7) return 'C-';
        if (grade >= 1.3) return 'D+';
        if (grade >= 1.0) return 'D';
        return 'F';
    }

    // Open add subject modal
    function openAddModal() {
        addSubjectForm.reset();
        addSubjectModal.style.display = 'flex';
    }

    // Open edit subject modal
    function openEditModal(index) {
        const subject = subjects[index];
        document.getElementById('edit-subject-id').value = index;
        document.getElementById('edit-subject-name').value = subject.name;
        document.getElementById('edit-subject-credits').value = subject.credits;
        document.getElementById('edit-subject-grade').value = subject.grade;
        document.getElementById('edit-subject-semester').value = subject.semester;
        editSubjectModal.style.display = 'flex';
    }

    // Close all modals
    function closeModals() {
        addSubjectModal.style.display = 'none';
        editSubjectModal.style.display = 'none';
        importModal.style.display = 'none';
    }

    // Add new subject
    function addSubject(e) {
        e.preventDefault();

        const newSubject = {
            name: document.getElementById('subject-name').value,
            credits: parseInt(document.getElementById('subject-credits').value),
            grade: parseFloat(document.getElementById('subject-grade').value),
            semester: document.getElementById('subject-semester').value
        };

        subjects.push(newSubject);
        saveData();
        updateUI();
        closeModals();
    }

    // Edit existing subject
    function editSubject(e) {
        e.preventDefault();

        const index = document.getElementById('edit-subject-id').value;
        subjects[index] = {
            name: document.getElementById('edit-subject-name').value,
            credits: parseInt(document.getElementById('edit-subject-credits').value),
            grade: parseFloat(document.getElementById('edit-subject-grade').value),
            semester: document.getElementById('edit-subject-semester').value
        };

        saveData();
        updateUI();
        closeModals();
    }

    // Delete subject
    function deleteSubject(index) {
        if (confirm('Are you sure you want to delete this subject?')) {
            subjects.splice(index, 1);
            saveData();
            updateUI();
            closeModals();
        }
    }

    // Calculate GPA forecast
    function calculateForecast() {
        const forecastGrade = parseFloat(document.getElementById('forecast-grade').value);
        const forecastCredits = parseInt(document.getElementById('forecast-credits').value);

        if (isNaN(forecastGrade) || isNaN(forecastCredits)) {
            alert('Please enter valid values for grade and credits');
            return;
        }

        const currentGPA = calculateGPA();
        const currentCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
        const totalCredits = currentCredits + forecastCredits;

        if (totalCredits === 0) {
            projectedGpaEl.textContent = '0.00';
            return;
        }

        const currentPoints = currentGPA * currentCredits;
        const forecastPoints = forecastGrade * forecastCredits;
        const projectedGPA = (currentPoints + forecastPoints) / totalCredits;

        projectedGpaEl.textContent = projectedGPA.toFixed(2);
    }

    // Import data
    function importData() {
        importModal.style.display = 'flex';
    }

    // Export data
    function exportData() {
        const data = {
            subjects,
            targetGPA
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'gpa-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Handle JSON upload
    function handleJsonUpload() {
        const fileInput = document.getElementById('json-upload');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                if (data.subjects && Array.isArray(data.subjects)) {
                    subjects = data.subjects;
                    targetGPA = data.targetGPA || 4.0;
                    saveData();
                    updateUI();
                    closeModals();
                    alert('Data imported successfully!');
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Load sample data
    function loadSampleData() {
        fetch('data/default-subjects.json')
            .then(response => response.json())
            .then(data => {
                subjects = data.subjects;
                targetGPA = data.targetGPA || 4.0;
                saveData();
                updateUI();
                closeModals();
                alert('Sample data loaded successfully!');
            })
            .catch(error => {
                console.error('Error loading sample data:', error);
                alert('Failed to load sample data');
            });
    }

    // Update chart
    function updateChart() {
        const ctx = document.getElementById('gpaTrendsChart').getContext('2d');

        // Group by semester
        const semesters = {};
        subjects.forEach(subject => {
            if (!semesters[subject.semester]) {
                semesters[subject.semester] = [];
            }
            semesters[subject.semester].push(subject);
        });

        // Calculate GPA per semester
        const labels = [];
        const data = [];

        Object.keys(semesters).sort().forEach(semester => {
            const semesterSubjects = semesters[semester];
            let totalPoints = 0;
            let totalCredits = 0;

            semesterSubjects.forEach(subject => {
                totalPoints += subject.grade * subject.credits;
                totalCredits += subject.credits;
            });

            const semesterGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

            labels.push(`Semester ${semester}`);
            data.push(semesterGPA);
        });

        // If no semester data, show overall GPA
        if (labels.length === 0) {
            labels.push('Overall');
            data.push(calculateGPA());
        }

        // Destroy previous chart if exists
        if (gpaTrendsChart) {
            gpaTrendsChart.destroy();
        }

        // Create new chart
        gpaTrendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'GPA Trend',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.0,
                        ticks: {
                            stepSize: 0.5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `GPA: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderGpaTrendChart() {
    const ctx = document.getElementById('gpaTrendChart').getContext('2d');
    const gpaTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'],
            datasets: [{
                label: 'GPA Trend',
                data: [3.2, 3.5, 3.7, 3.8],
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 2.0,
                    max: 4.0
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'GPA Trend Over Semesters'
                }
            }
        }
    });
}

function renderGradeDistributionChart() {
    const ctx = document.getElementById('gradeDistributionChart').getContext('2d');
    const gradeDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                label: 'Number of Courses',
                data: [8, 5, 2, 1, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Grade Distribution'
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderGpaTrendChart();
    renderGradeDistributionChart();
});

    // Event Listeners
    addSubjectBtn.addEventListener('click', openAddModal);
    addSubjectForm.addEventListener('submit', addSubject);
    editSubjectForm.addEventListener('submit', editSubject);
    deleteSubjectBtn.addEventListener('click', function() {
        const index = document.getElementById('edit-subject-id').value;
        deleteSubject(index);
    });
    semesterSelect.addEventListener('change', renderSubjectsTable);
    importBtn.addEventListener('click', importData);
    exportBtn.addEventListener('click', exportData);
    uploadJsonBtn.addEventListener('click', handleJsonUpload);
    loadSampleBtn.addEventListener('click', loadSampleData);
    forecastBtn.addEventListener('click', calculateForecast);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModals));

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Initialize
    loadData();
});