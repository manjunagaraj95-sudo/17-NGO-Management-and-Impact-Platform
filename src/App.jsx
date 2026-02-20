
import React, { useState, useEffect, createContext, useContext } from 'react';

// --- Contexts ---
const AuthContext = createContext(null);
const NavigationContext = createContext(null);
const ToastContext = createContext(null);

// --- Dummy Data ---
const DUMMY_DATA = {
    users: [
        { id: 'u1', name: 'NGO Admin', email: 'admin@seva.org', role: 'NGO Admin' },
        { id: 'u2', name: 'Project Manager', email: 'pm@seva.org', role: 'Project Manager' },
        { id: 'u3', name: 'Volunteer Alice', email: 'alice@seva.org', role: 'Volunteer' },
        { id: 'u4', name: 'Donor Corp', email: 'donor@seva.org', role: 'Donor' },
        { id: 'u5', name: 'Beneficiary John', email: 'john@seva.org', role: 'Beneficiary' },
    ],
    projects: [
        {
            id: 'p1', title: 'Clean Water Initiative', status: 'Approved',
            description: 'Providing clean drinking water to rural communities.',
            startDate: '2023-01-15', endDate: '2024-06-30', budget: 150000,
            manager: 'u2', beneficiariesImpacted: 1200, location: 'Rural Sector A',
            workflowHistory: [
                { stage: 'Draft', date: '2022-12-01', user: 'u2' },
                { stage: 'Pending Approval', date: '2022-12-10', user: 'u2' },
                { stage: 'Approved', date: '2023-01-05', user: 'u1' }
            ],
            tasks: ['t1', 't2', 't3'], documents: ['doc1', 'doc2']
        },
        {
            id: 'p2', title: 'Digital Literacy Program', status: 'In Progress',
            description: 'Educating youth and adults in basic computer skills.',
            startDate: '2023-03-01', endDate: '2024-09-30', budget: 80000,
            manager: 'u2', beneficiariesImpacted: 800, location: 'Urban Slum X',
            workflowHistory: [
                { stage: 'Draft', date: '2023-02-01', user: 'u2' },
                { stage: 'Pending Approval', date: '2023-02-10', user: 'u2' },
                { stage: 'In Progress', date: '2023-02-25', user: 'u1' }
            ],
            tasks: ['t4', 't5'], documents: ['doc3']
        },
        {
            id: 'p3', title: 'Food Security Support', status: 'Pending Approval',
            description: 'Distributing food packages to vulnerable families.',
            startDate: '2023-07-01', endDate: '2024-03-31', budget: 60000,
            manager: 'u2', beneficiariesImpacted: 500, location: 'District B',
            workflowHistory: [
                { stage: 'Draft', date: '2023-06-01', user: 'u2' },
                { stage: 'Pending Approval', date: '2023-06-08', user: 'u2' }
            ],
            tasks: [], documents: []
        },
        {
            id: 'p4', title: 'Healthcare Access', status: 'Rejected',
            description: 'Mobile clinic services for remote areas.',
            startDate: '2023-05-01', endDate: '2024-04-30', budget: 100000,
            manager: 'u2', beneficiariesImpacted: 600, location: 'Mountain Village C',
            workflowHistory: [
                { stage: 'Draft', date: '2023-04-01', user: 'u2' },
                { stage: 'Pending Approval', date: '2023-04-10', user: 'u2' },
                { stage: 'Rejected', date: '2023-04-20', user: 'u1', reason: 'Budget overruns' }
            ],
            tasks: [], documents: []
        },
        {
            id: 'p5', title: 'Youth Skill Development', status: 'Draft',
            description: 'Workshops for vocational training and job placement.',
            startDate: '2024-01-01', endDate: '2024-12-31', budget: 75000,
            manager: 'u2', beneficiariesImpacted: 300, location: 'City Center',
            workflowHistory: [
                { stage: 'Draft', date: '2023-11-01', user: 'u2' },
            ],
            tasks: [], documents: []
        },
    ],
    beneficiaries: [
        { id: 'b1', name: 'John Doe', project: 'p1', supportType: 'Water Access', status: 'Active', enrollmentDate: '2023-02-01', impactScore: 85, location: 'Village A-1' },
        { id: 'b2', name: 'Jane Smith', project: 'p2', supportType: 'Digital Skills', status: 'Active', enrollmentDate: '2023-03-10', impactScore: 78, location: 'Slum X-5' },
        { id: 'b3', name: 'Maria Garcia', project: 'p1', supportType: 'Water Access', status: 'Inactive', enrollmentDate: '2023-02-15', impactScore: 90, location: 'Village A-2' },
        { id: 'b4', name: 'Ahmed Khan', project: 'p2', supportType: 'Digital Skills', status: 'Pending Enrollment', enrollmentDate: '2023-07-05', impactScore: null, location: 'Slum X-7' },
        { id: 'b5', name: 'Emily White', project: 'p3', supportType: 'Food Aid', status: 'Active', enrollmentDate: '2023-07-10', impactScore: 70, location: 'District B-3' },
    ],
    donors: [
        { id: 'd1', name: 'Global Aid Foundation', contact: 'anna@global.org', status: 'Active', totalDonations: 250000, lastDonationDate: '2023-10-20' },
        { id: 'd2', name: 'Tech Solutions Inc.', contact: 'bill@tech.com', status: 'Active', totalDonations: 100000, lastDonationDate: '2023-09-15' },
        { id: 'd3', name: 'Local Community Bank', contact: 'carol@bank.com', status: 'Inactive', totalDonations: 50000, lastDonationDate: '2022-12-01' },
        { id: 'd4', name: 'Individual Supporter', contact: 'david@mail.com', status: 'Pending Verification', totalDonations: 5000, lastDonationDate: '2023-11-01' },
    ],
    volunteers: [
        { id: 'v1', name: 'Alice Johnson', email: 'alice.j@seva.org', status: 'Active', assignedProjects: ['p1', 'p2'], hoursLogged: 150, skills: ['Water Sanitation', 'Teaching'] },
        { id: 'v2', name: 'Bob Williams', email: 'bob.w@seva.org', status: 'Active', assignedProjects: ['p2'], hoursLogged: 80, skills: ['IT Support', 'Mentoring'] },
        { id: 'v3', name: 'Charlie Brown', email: 'charlie.b@seva.org', status: 'Inactive', assignedProjects: ['p1'], hoursLogged: 50, skills: ['Logistics'] },
        { id: 'v4', name: 'Diana Prince', email: 'diana.p@seva.org', status: 'Pending Approval', assignedProjects: [], hoursLogged: 0, skills: ['Healthcare'] },
    ],
    tasks: [
        { id: 't1', projectId: 'p1', title: 'Install Water Filter', assignedTo: 'v1', status: 'Completed', dueDate: '2023-03-15', priority: 'High', description: 'Install bio-sand filter in Village A-1.' },
        { id: 't2', projectId: 'p1', title: 'Community Awareness Session', assignedTo: 'v1', status: 'In Progress', dueDate: '2023-04-10', priority: 'Medium', description: 'Conduct session on water hygiene.' },
        { id: 't3', projectId: 'p1', title: 'Water Quality Testing', assignedTo: 'v3', status: 'Pending', dueDate: '2023-05-01', priority: 'High', description: 'Collect and test water samples.' },
        { id: 't4', projectId: 'p2', title: 'Setup Computer Lab', assignedTo: 'v2', status: 'Completed', dueDate: '2023-03-30', priority: 'High', description: 'Configure 10 computers for training.' },
        { id: 't5', projectId: 'p2', title: 'Develop Training Modules', assignedTo: 'v2', status: 'In Progress', dueDate: '2023-04-20', priority: 'Medium', description: 'Create beginner-level digital literacy content.' },
    ],
    donations: [
        { id: 'dn1', donorId: 'd1', projectId: 'p1', amount: 50000, date: '2023-01-20', status: 'Completed', type: 'Grant' },
        { id: 'dn2', donorId: 'd1', projectId: 'p2', amount: 20000, date: '2023-03-05', status: 'Completed', type: 'Grant' },
        { id: 'dn3', donorId: 'd2', projectId: 'p1', amount: 10000, date: '2023-02-10', status: 'Completed', type: 'Corporate Donation' },
        { id: 'dn4', donorId: 'd2', projectId: 'p2', amount: 5000, date: '2023-04-01', status: 'Pending', type: 'Corporate Donation' },
        { id: 'dn5', donorId: 'd4', projectId: 'p3', amount: 500, date: '2023-11-01', status: 'Pending', type: 'Individual Donation' },
    ],
    auditLogs: [
        { id: 'al1', timestamp: '2023-11-01 10:00:00', user: 'u1', action: 'Project p1 status changed to Approved', resourceType: 'Project', resourceId: 'p1' },
        { id: 'al2', timestamp: '2023-11-01 10:05:30', user: 'u2', action: 'Beneficiary b2 updated', resourceType: 'Beneficiary', resourceId: 'b2' },
        { id: 'al3', timestamp: '2023-11-01 11:15:00', user: 'u1', action: 'User u3 role updated to Volunteer', resourceType: 'User', resourceId: 'u3' },
        { id: 'al4', timestamp: '2023-11-01 12:00:00', user: 'u4', action: 'Donation dn5 submitted', resourceType: 'Donation', resourceId: 'dn5' },
        { id: 'al5', timestamp: '2023-11-01 13:30:00', user: 'u2', action: 'Task t5 updated to In Progress', resourceType: 'Task', resourceId: 't5' },
    ]
};

// --- RBAC Rules ---
const ACCESS_RULES = {
    'NGO Admin': {
        dashboard: true,
        projects: ['view', 'create', 'edit', 'delete', 'approve'],
        beneficiaries: ['view', 'create', 'edit', 'delete'],
        donors: ['view', 'create', 'edit', 'delete'],
        volunteers: ['view', 'create', 'edit', 'delete', 'approve'],
        donations: ['view', 'edit'],
        tasks: ['view', 'create', 'edit', 'delete'],
        reports: true,
        settings: true,
        auditLogs: ['view']
    },
    'Project Manager': {
        dashboard: true,
        projects: ['view', 'create', 'edit'],
        beneficiaries: ['view', 'create', 'edit'],
        donors: ['view'],
        volunteers: ['view', 'assign'],
        donations: ['view'],
        tasks: ['view', 'create', 'edit'],
        reports: true,
        settings: false,
        auditLogs: ['view']
    },
    'Volunteer': {
        dashboard: true,
        projects: ['view_assigned'],
        beneficiaries: ['view_assigned'],
        donors: false,
        volunteers: ['view_self', 'edit_self'],
        donations: false,
        tasks: ['view_assigned', 'edit_status'],
        reports: false,
        settings: false,
        auditLogs: false
    },
    'Donor': {
        dashboard: true,
        projects: ['view_public'],
        beneficiaries: false,
        donors: ['view_self', 'edit_self'],
        donations: ['view_self', 'create'],
        volunteers: false,
        tasks: false,
        reports: false,
        settings: false,
        auditLogs: false
    },
    'Beneficiary': {
        dashboard: true,
        projects: ['view_assigned'],
        beneficiaries: ['view_self', 'edit_self'],
        donors: false,
        volunteers: false,
        donations: false,
        tasks: false,
        reports: false,
        settings: false,
        auditLogs: false
    }
};

const canAccess = (userRole, resource, action = 'view') => {
    if (!userRole || !ACCESS_RULES[userRole]) {
        return false;
    }
    const permissions = ACCESS_RULES[userRole][resource];
    if (typeof permissions === 'boolean') {
        return permissions;
    }
    if (Array.isArray(permissions)) {
        return permissions.includes(action);
    }
    return false;
};

// --- Helper Functions ---
const getStatusColorClass = (status) => {
    const statusMap = {
        'Approved': 'status-approved', 'Completed': 'status-completed', 'Closed': 'status-closed',
        'In Progress': 'status-in-progress', 'Assigned': 'status-assigned',
        'Pending': 'status-pending', 'Action Required': 'status-action-required', 'Pending Approval': 'status-pending', 'Pending Verification': 'status-pending', 'Pending Enrollment': 'status-pending',
        'Rejected': 'status-rejected', 'SLA Breach': 'status-sla-breach', 'Blocked': 'status-blocked',
        'Exception': 'status-exception', 'Escalation': 'status-escalation',
        'Draft': 'status-draft', 'Archived': 'status-archived', 'Inactive': 'status-archived',
        'Active': 'status-approved' // Active beneficiaries/donors
    };
    return statusMap[status] || 'status-grey';
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- Reusable Components ---

const Icon = ({ name, className = '' }) => <span className={`icon icon-${name} ${className}`} />;

const Button = ({ onClick, children, className = 'button-primary', type = 'button', disabled = false }) => (
    <button type={type} onClick={onClick} className={`button ${className}`} disabled={disabled}>
        {children}
    </button>
);

const Card = ({ title, status, description, onClick, footer, children, className = '', id }) => (
    <div className={`card ${getStatusColorClass(status)} ${className}`} onClick={() => onClick(id)}>
        <div className="card-header">
            <h3>{title}</h3>
            {status && <span className="status-badge">{status}</span>}
        </div>
        <div className="card-body">
            <p>{description}</p>
            {children}
        </div>
        {footer && <div className="card-footer">{footer}</div>}
    </div>
);

const FormField = ({ label, name, type = 'text', value, onChange, required = false, readOnly = false, options = [], fileUpload = false, min, max, placeholder }) => {
    const renderInput = () => {
        const inputProps = {
            id: name, name, value, onChange, required, readOnly, placeholder
        };

        switch (type) {
            case 'textarea':
                return <textarea {...inputProps} />;
            case 'select':
                return (
                    <select {...inputProps}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'file':
                return (
                    <div className="file-upload-area">
                        <input type="file" id={name} name={name} onChange={onChange} required={required} multiple={false} />
                        <label htmlFor={name} className="button button-secondary">
                            <Icon name="file" /> Upload File
                        </label>
                        {value && <span style={{ marginLeft: 'var(--spacing-md)' }}>{value.name || value}</span>}
                    </div>
                );
            case 'number':
                return <input type="number" min={min} max={max} {...inputProps} />;
            case 'date':
                return <input type="date" {...inputProps} />;
            default:
                return <input type={type} {...inputProps} />;
        }
    };

    return (
        <div className="form-group">
            <label htmlFor={name}>
                {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
            </label>
            {renderInput()}
        </div>
    );
};

const WorkflowTracker = ({ workflowHistory, currentStatus }) => {
    const stages = ['Draft', 'Pending Approval', 'In Progress', 'Approved', 'Completed', 'Rejected']; // Example stages

    const getStageStatus = (stage) => {
        const historyStages = workflowHistory.map(h => h.stage);
        const currentIndex = stages.indexOf(currentStatus);
        const stageIndex = stages.indexOf(stage);

        if (stageIndex < currentIndex) return 'completed';
        if (stageIndex === currentIndex) return 'active';
        if (historyStages.includes(stage) && stageIndex === currentIndex) return 'active'; // In case status is not in history
        return '';
    };

    return (
        <div className="workflow-tracker">
            {stages.map((stage, index) => (
                <div key={stage} className={`workflow-stage ${getStageStatus(stage)}`}>
                    <div className="workflow-stage-icon">
                        {getStageStatus(stage) === 'completed' && <Icon name="check" />}
                        {getStageStatus(stage) === 'active' && <Icon name="info-circle" />}
                        {getStageStatus(stage) === '' && index + 1}
                    </div>
                    {stage}
                    {index < stages.length - 1 && <div className="workflow-stage-connector"></div>}
                </div>
            ))}
        </div>
    );
};

const Toast = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000); // Auto-close after 5 seconds
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const typeClass = `toast-${type || 'info'}`;

    return (
        <div className={`toast ${typeClass}`}>
            {type === 'success' && <Icon name="check" />}
            {type === 'error' && <Icon name="alert" />}
            {type === 'warning' && <Icon name="alert" />}
            {type === 'info' && <Icon name="info-circle" />}
            <span>{message}</span>
            <button className="toast-close" onClick={() => onClose(id)}>&times;</button>
        </div>
    );
};

// --- Screens ---

const LoginForm = () => {
    const [email, setEmail] = useState('admin@seva.org'); // Default to Admin for easy testing
    const [password, setPassword] = useState('password');
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = DUMMY_DATA.users.find(u => u.email === email && password === 'password'); // Simplified auth
        if (user) {
            login(user);
        } else {
            alert('Invalid credentials'); // Use toast later
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh',
            backgroundColor: '#e9ecef'
        }}>
            <form onSubmit={handleSubmit} style={{
                backgroundColor: '#ffffff', padding: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-lg)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '400px', maxWidth: '90%'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', color: 'var(--primary-color)' }}>SevaConnect Login</h2>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                />
                <Button type="submit" className="button-primary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>Login</Button>
                <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                    <p>Try with: </p>
                    <p>NGO Admin: <strong>admin@seva.org</strong></p>
                    <p>Project Manager: <strong>pm@seva.org</strong></p>
                    <p>Volunteer: <strong>alice@seva.org</strong></p>
                    <p>Donor: <strong>donor@seva.org</strong></p>
                    <p>Beneficiary: <strong>john@seva.org</strong></p>
                    <p>Password for all: <strong>password</strong></p>
                </div>
            </form>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { navigate } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);

    const filteredProjects = DUMMY_DATA.projects.filter(p => {
        if (user.role === 'Project Manager') return p.manager === user.id;
        if (user.role === 'Volunteer') return p.tasks.some(taskId => DUMMY_DATA.tasks.find(t => t.id === taskId)?.assignedTo === user.id);
        if (user.role === 'Beneficiary') return DUMMY_DATA.beneficiaries.some(b => b.project === p.id && b.name.includes(user.name.split(' ')[1])); // Simple name match
        return true; // NGO Admin, Donor (view_public) sees all, but Donor has specific projects view below
    });

    const activeProjects = filteredProjects.filter(p => p.status === 'Approved' || p.status === 'In Progress').length;
    const pendingApprovals = filteredProjects.filter(p => p.status === 'Pending Approval').length;
    const totalBeneficiaries = DUMMY_DATA.beneficiaries.filter(b => {
        if (user.role === 'Project Manager') return filteredProjects.some(fp => fp.id === b.project);
        if (user.role === 'Beneficiary') return b.name.includes(user.name.split(' ')[1]);
        return true;
    }).length;
    const totalDonations = DUMMY_DATA.donations.filter(d => {
        if (user.role === 'Donor') return d.donorId === user.id;
        return true;
    }).reduce((sum, d) => sum + d.amount, 0);

    // Filter projects for 'My Projects' card based on role
    const myProjects = DUMMY_DATA.projects.filter(project => {
        if (user.role === 'Project Manager' && project.manager === user.id) return true;
        if (user.role === 'Volunteer' && project.tasks.some(taskId => DUMMY_DATA.tasks.find(t => t.id === taskId)?.assignedTo === user.id)) return true;
        if (user.role === 'Beneficiary' && project.id === DUMMY_DATA.beneficiaries.find(b => b.name.includes(user.name.split(' ')[1]))?.project) return true;
        return false;
    });

    const myTasks = DUMMY_DATA.tasks.filter(task => task.assignedTo === user.id);
    const myDonations = DUMMY_DATA.donations.filter(donation => donation.donorId === user.id);
    const myBeneficiaryRecord = DUMMY_DATA.beneficiaries.find(b => b.name.includes(user.name.split(' ')[1])); // For Beneficiary role

    useEffect(() => {
        if (user.role === 'NGO Admin') {
            showToast('Welcome, Admin! Full control enabled.', 'info');
        } else if (user.role === 'Project Manager') {
            showToast('Welcome, Project Manager! Focus on your projects.', 'info');
        }
    }, [user.role, showToast]);

    return (
        <div className="dashboard">
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Welcome, {user.name}!</h1>

            {canAccess(user.role, 'dashboard') && (
                <>
                    <div className="kpi-card-grid">
                        <div className="kpi-card" style={{ borderBottomColor: 'var(--primary-color)' }}>
                            <h3>Total Projects</h3>
                            <div className="kpi-value">{filteredProjects.length}</div>
                            <div className="kpi-trend positive"><Icon name="arrow-up" /> 12% last month</div>
                        </div>
                        <div className="kpi-card" style={{ borderBottomColor: 'var(--status-green)' }}>
                            <h3>Active Projects</h3>
                            <div className="kpi-value">{activeProjects}</div>
                            <div className="kpi-trend positive"><Icon name="arrow-up" /> 5% this quarter</div>
                        </div>
                        {(canAccess(user.role, 'projects', 'approve') || canAccess(user.role, 'projects', 'view')) && (
                            <div className="kpi-card" style={{ borderBottomColor: 'var(--status-orange)' }}>
                                <h3>Pending Approvals</h3>
                                <div className="kpi-value">{pendingApprovals}</div>
                                <div className="kpi-trend negative"><Icon name="arrow-down" /> 2 since last week</div>
                            </div>
                        )}
                        <div className="kpi-card" style={{ borderBottomColor: 'var(--status-blue)' }}>
                            <h3>Beneficiaries Impacted</h3>
                            <div className="kpi-value">{totalBeneficiaries}</div>
                            <div className="kpi-trend positive"><Icon name="arrow-up" /> 18% year-to-date</div>
                        </div>
                        {canAccess(user.role, 'donations', 'view') && (
                            <div className="kpi-card" style={{ borderBottomColor: 'var(--status-purple)' }}>
                                <h3>Total Donations</h3>
                                <div className="kpi-value">{formatCurrency(totalDonations)}</div>
                                <div className="kpi-trend positive"><Icon name="arrow-up" /> 7% last quarter</div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                        <div className="chart-container">
                            <h3>Project Status Overview <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Bar Chart - Real-time)</span></h3>
                            <div className="chart-placeholder">Bar Chart Placeholder</div>
                        </div>
                        <div className="chart-container">
                            <h3>Beneficiaries per Project <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Donut Chart - Real-time)</span></h3>
                            <div className="chart-placeholder">Donut Chart Placeholder</div>
                        </div>
                    </div>
                </>
            )}

            {user.role === 'Project Manager' && myProjects.length > 0 && (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>My Projects</h2>
                    <div className="card-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {myProjects.map(project => (
                            <Card
                                key={project.id}
                                id={project.id}
                                title={project.title}
                                status={project.status}
                                description={project.description}
                                onClick={() => navigate('ProjectDetail', project)}
                                footer={
                                    <div className="card-meta">
                                        <span>Budget: {formatCurrency(project.budget)}</span>
                                        <span>Start: {formatDate(project.startDate)}</span>
                                        <span>Beneficiaries: {project.beneficiariesImpacted}</span>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </>
            )}

            {user.role === 'Volunteer' && myTasks.length > 0 && (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>My Assigned Tasks</h2>
                    <div className="card-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {myTasks.map(task => (
                            <Card
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                status={task.status}
                                description={task.description}
                                onClick={() => navigate('TaskDetail', task)}
                                footer={
                                    <div className="card-meta">
                                        <span>Due: {formatDate(task.dueDate)}</span>
                                        <span>Priority: {task.priority}</span>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </>
            )}

            {user.role === 'Donor' && myDonations.length > 0 && (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>My Recent Donations</h2>
                    <div className="card-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {myDonations.map(donation => {
                            const project = DUMMY_DATA.projects.find(p => p.id === donation.projectId);
                            return (
                                <Card
                                    key={donation.id}
                                    id={donation.id}
                                    title={`Donation to ${project?.title || 'N/A'}`}
                                    status={donation.status}
                                    description={`Amount: ${formatCurrency(donation.amount)}`}
                                    onClick={() => navigate('DonationDetail', donation)}
                                    footer={
                                        <div className="card-meta">
                                            <span>Date: {formatDate(donation.date)}</span>
                                            <span>Type: {donation.type}</span>
                                        </div>
                                    }
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {user.role === 'Beneficiary' && myBeneficiaryRecord && (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>My Beneficiary Record</h2>
                    <div className="card-grid" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <Card
                            key={myBeneficiaryRecord.id}
                            id={myBeneficiaryRecord.id}
                            title={myBeneficiaryRecord.name}
                            status={myBeneficiaryRecord.status}
                            description={`Project: ${DUMMY_DATA.projects.find(p => p.id === myBeneficiaryRecord.project)?.title || 'N/A'}`}
                            onClick={() => navigate('BeneficiaryDetail', myBeneficiaryRecord)}
                            footer={
                                <div className="card-meta">
                                    <span>Support: {myBeneficiaryRecord.supportType}</span>
                                    <span>Enrolled: {formatDate(myBeneficiaryRecord.enrollmentDate)}</span>
                                    {myBeneficiaryRecord.impactScore && <span>Impact Score: {myBeneficiaryRecord.impactScore}</span>}
                                </div>
                            }
                        />
                    </div>
                </>
            )}

            <h2 style={{ marginBottom: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>Recent Activities</h2>
            <div className="data-grid" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Resource</th>
                    </tr>
                </thead>
                <tbody>
                    {DUMMY_DATA.auditLogs.slice(0, 5).map(log => (
                        <tr key={log.id}>
                            <td>{log.timestamp}</td>
                            <td>{DUMMY_DATA.users.find(u => u.id === log.user)?.name || 'N/A'}</td>
                            <td>{log.action}</td>
                            <td>{log.resourceType} ({log.resourceId})</td>
                        </tr>
                    ))}
                </tbody>
            </div>
        </div>
    );
};

const ProjectForm = ({ project, onSubmit, onCancel, readOnly = false }) => {
    const { user } = useContext(AuthContext);
    const isEdit = !!project;
    const [formData, setFormData] = useState(project || {
        id: `p${DUMMY_DATA.projects.length + 1}`,
        title: '', description: '', startDate: '', endDate: '', budget: '',
        manager: user.role === 'Project Manager' ? user.id : '', beneficiariesImpacted: 0, location: '',
        status: 'Draft', workflowHistory: [{ stage: 'Draft', date: new Date().toISOString().split('T')[0], user: user.id }], tasks: [], documents: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0].name })); // Store file name as a string
    };

    const projectManagers = DUMMY_DATA.users.filter(u => u.role === 'Project Manager');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.budget || !formData.manager) {
            alert('Please fill all required fields.'); // Replace with toast
            return;
        }
        onSubmit(formData);
    };

    const formTitle = isEdit ? (readOnly ? `View Project: ${formData.title}` : `Edit Project: ${formData.title}`) : 'Create New Project';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{formTitle}</h2>
            <form onSubmit={handleFormSubmit}>
                <FormField
                    label="Project Title" name="title" value={formData.title} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    placeholder="e.g., Clean Water Initiative"
                />
                <FormField
                    label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    placeholder="Detailed description of the project"
                />
                <div className="flex-group">
                    <FormField
                        label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    />
                    <FormField
                        label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    />
                </div>
                <div className="flex-group">
                    <FormField
                        label="Budget" name="budget" type="number" value={formData.budget} onChange={handleChange} required min="0"
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    />
                    <FormField
                        label="Beneficiaries Impacted" name="beneficiariesImpacted" type="number" value={formData.beneficiariesImpacted} onChange={handleChange} required min="0"
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                    />
                </div>
                <div className="flex-group">
                    <FormField
                        label="Project Manager" name="manager" type="select" value={formData.manager} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                        options={[
                            { value: '', label: 'Select Manager' },
                            ...projectManagers.map(pm => ({ value: pm.id, label: pm.name }))
                        ]}
                    />
                    <FormField
                        label="Location" name="location" value={formData.location} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'projects', 'edit')}
                        placeholder="e.g., Rural Sector A"
                    />
                </div>
                {canAccess(user.role, 'projects', 'edit') && (
                    <FormField
                        label="Project Document" name="document" type="file" value={formData.documents?.[0]} onChange={handleFileChange}
                    />
                )}

                <div className="form-actions">
                    {!readOnly && (canAccess(user.role, 'projects', isEdit ? 'edit' : 'create')) && (
                        <Button type="submit" className="button-primary">{isEdit ? 'Save Changes' : 'Create Project'}</Button>
                    )}
                    <Button type="button" onClick={onCancel} className="button-secondary">Cancel</Button>
                </div>
            </form>
        </div>
    );
};

const ProjectDetail = ({ project, onUpdateProject, onDeleteProject }) => {
    const { user } = useContext(AuthContext);
    const { navigate, goBack } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);
    const [editMode, setEditMode] = useState(false);
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [approvalReason, setApprovalReason] = useState('');
    const [approvalStatus, setApprovalStatus] = useState(''); // 'Approved' or 'Rejected'

    if (!project) {
        return <div className="full-screen-view">Loading project details...</div>;
    }

    const handleSave = (updatedProject) => {
        onUpdateProject({ ...updatedProject, status: project.status, workflowHistory: project.workflowHistory });
        setEditMode(false);
        showToast('Project updated successfully!', 'success');
    };

    const handleApprove = (status) => {
        setShowApprovalForm(true);
        setApprovalStatus(status);
    };

    const submitApproval = () => {
        if (!approvalReason && approvalStatus === 'Rejected') {
            alert('Reason is required for rejection.');
            return;
        }

        const newStatus = approvalStatus;
        const newWorkflowEntry = {
            stage: newStatus,
            date: new Date().toISOString().split('T')[0],
            user: user.id,
            reason: approvalStatus === 'Rejected' ? approvalReason : undefined
        };
        const updatedWorkflow = [...project.workflowHistory, newWorkflowEntry];
        onUpdateProject({ ...project, status: newStatus, workflowHistory: updatedWorkflow });
        setShowApprovalForm(false);
        setApprovalReason('');
        showToast(`Project ${newStatus.toLowerCase()}!`, newStatus === 'Approved' ? 'success' : 'error');
    };

    const relatedBeneficiaries = DUMMY_DATA.beneficiaries.filter(b => b.project === project.id);
    const relatedTasks = DUMMY_DATA.tasks.filter(t => project.tasks.includes(t.id));
    const relatedDonations = DUMMY_DATA.donations.filter(d => d.projectId === project.id);
    const projectManager = DUMMY_DATA.users.find(u => u.id === project.manager);

    if (editMode) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setEditMode(false)} className="back-button"><Icon name="back" /> Back to Project Details</Button>
                <ProjectForm project={project} onSubmit={handleSave} onCancel={() => setEditMode(false)} />
            </div>
        );
    }

    if (showApprovalForm) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setShowApprovalForm(false)} className="back-button"><Icon name="back" /> Back to Project Details</Button>
                <h2>{approvalStatus === 'Approved' ? 'Approve Project' : 'Reject Project'}</h2>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <p>Are you sure you want to {approvalStatus.toLowerCase()} project "{project.title}"?</p>
                    {approvalStatus === 'Rejected' && (
                        <FormField
                            label="Reason for Rejection" name="reason" type="textarea"
                            value={approvalReason} onChange={(e) => setApprovalReason(e.target.value)} required
                            placeholder="Provide details for rejection"
                        />
                    )}
                    <div className="form-actions">
                        <Button onClick={submitApproval} className={approvalStatus === 'Approved' ? 'button-primary' : 'button-danger'}>
                            {approvalStatus}
                        </Button>
                        <Button onClick={() => setShowApprovalForm(false)} className="button-secondary">Cancel</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back to Projects</Button>
            <div className="section-header">
                <h1 className={`${getStatusColorClass(project.status).replace('status-', 'text-')}`}>
                    {project.title} <span className="status-badge">{project.status}</span>
                </h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {(canAccess(user.role, 'projects', 'edit')) && (
                        <Button onClick={() => setEditMode(true)} className="button-primary"><Icon name="edit" /> Edit Project</Button>
                    )}
                    {canAccess(user.role, 'projects', 'approve') && project.status === 'Pending Approval' && (
                        <>
                            <Button onClick={() => handleApprove('Approved')} className="button-primary"><Icon name="approve" /> Approve</Button>
                            <Button onClick={() => handleApprove('Rejected')} className="button-secondary"><Icon name="reject" /> Reject</Button>
                        </>
                    )}
                    {canAccess(user.role, 'projects', 'delete') && (
                        <Button onClick={() => onDeleteProject(project.id)} className="button-danger" style={{ backgroundColor: 'var(--danger-color)' }}>Delete</Button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h3>Project Overview</h3>
                    <p>{project.description}</p>
                    <div className="flex-group" style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div><strong>Start Date:</strong> {formatDate(project.startDate)}</div>
                        <div><strong>End Date:</strong> {formatDate(project.endDate)}</div>
                        <div><strong>Budget:</strong> {formatCurrency(project.budget)}</div>
                    </div>
                    <div className="flex-group">
                        <div><strong>Manager:</strong> {projectManager?.name || 'N/A'}</div>
                        <div><strong>Location:</strong> {project.location}</div>
                        <div><strong>Impacted Beneficiaries:</strong> {project.beneficiariesImpacted}</div>
                    </div>

                    <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Workflow Progress</h3>
                    <WorkflowTracker workflowHistory={project.workflowHistory} currentStatus={project.status} />

                    <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Project Documents</h3>
                    {project.documents && project.documents.length > 0 ? (
                        <ul>
                            {project.documents.map((doc, index) => (
                                <li key={index}><Icon name="file" /> {doc} (View/Download)</li>
                            ))}
                        </ul>
                    ) : <p>No documents uploaded.</p>}
                </div>
                <div>
                    <div className="chart-container" style={{ minHeight: 'auto', marginBottom: 'var(--spacing-xl)' }}>
                        <h3>Budget Utilization <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Gauge Chart)</span></h3>
                        <div className="chart-placeholder">Gauge Chart: 75% Utilized</div>
                    </div>
                    <div className="chart-container" style={{ minHeight: 'auto' }}>
                        <h3>SLA Status <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Line Chart)</span></h3>
                        <div className="chart-placeholder">Line Chart: On Track</div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Related Beneficiaries</h3>
            <div className="card-grid">
                {relatedBeneficiaries.length > 0 ? relatedBeneficiaries.map(b => (
                    <Card
                        key={b.id}
                        id={b.id}
                        title={b.name}
                        status={b.status}
                        description={`Support: ${b.supportType}`}
                        onClick={() => navigate('BeneficiaryDetail', b)}
                        footer={
                            <div className="card-meta">
                                <span>Location: {b.location}</span>
                                <span>Enrolled: {formatDate(b.enrollmentDate)}</span>
                            </div>
                        }
                    />
                )) : <p>No beneficiaries linked to this project.</p>}
            </div>

            <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Assigned Tasks</h3>
            <div className="card-grid">
                {relatedTasks.length > 0 ? relatedTasks.map(task => (
                    <Card
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        status={task.status}
                        description={task.description}
                        onClick={() => navigate('TaskDetail', task)}
                        footer={
                            <div className="card-meta">
                                <span>Assigned to: {DUMMY_DATA.volunteers.find(v => v.id === task.assignedTo)?.name || 'N/A'}</span>
                                <span>Due: {formatDate(task.dueDate)}</span>
                            </div>
                        }
                    />
                )) : <p>No tasks assigned to this project.</p>}
            </div>

            <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Donations Received</h3>
            <div className="card-grid">
                {relatedDonations.length > 0 ? relatedDonations.map(donation => {
                    const donor = DUMMY_DATA.donors.find(d => d.id === donation.donorId);
                    return (
                        <Card
                            key={donation.id}
                            id={donation.id}
                            title={`${donor?.name || 'Anonymous'}: ${formatCurrency(donation.amount)}`}
                            status={donation.status}
                            description={`Type: ${donation.type}`}
                            onClick={() => navigate('DonationDetail', donation)}
                            footer={
                                <div className="card-meta">
                                    <span>Date: {formatDate(donation.date)}</span>
                                    <span>Status: {donation.status}</span>
                                </div>
                            }
                        />
                    );
                }) : <p>No donations received for this project yet.</p>}
            </div>
        </div>
    );
};

const ProjectsList = () => {
    const { user } = useContext(AuthContext);
    const { navigate, showToast } = useContext(NavigationContext);
    const [projects, setProjects] = useState(DUMMY_DATA.projects);
    const [filters, setFilters] = useState({ status: 'All', search: '' });
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);

    const handleUpdateProject = (updatedProject) => {
        setProjects(prev => prev.map(p => (p.id === updatedProject.id ? updatedProject : p)));
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            navigate('Projects'); // Go back to list
            showToast('Project deleted successfully!', 'success');
        }
    };

    const handleCreateProject = (newProject) => {
        setProjects(prev => [...prev, newProject]);
        setShowNewProjectForm(false);
        showToast('Project created successfully!', 'success');
    };

    const filteredProjects = projects.filter(project => {
        const matchesRole = () => {
            if (user.role === 'Project Manager') return project.manager === user.id;
            if (user.role === 'Volunteer') return project.tasks.some(taskId => DUMMY_DATA.tasks.find(t => t.id === taskId)?.assignedTo === user.id);
            if (user.role === 'Beneficiary') return project.id === DUMMY_DATA.beneficiaries.find(b => b.name.includes(user.name.split(' ')[1]))?.project;
            if (user.role === 'Donor') return true; // Donors can view public projects, all are public by default here
            return true; // Admin sees all
        };

        const matchesStatus = filters.status === 'All' || project.status === filters.status;
        const matchesSearch = project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                              project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                              project.location.toLowerCase().includes(filters.search.toLowerCase());
        return matchesRole() && matchesStatus && matchesSearch;
    });

    const projectStatusOptions = [
        { value: 'All', label: 'All Statuses' },
        ...Array.from(new Set(DUMMY_DATA.projects.map(p => p.status))).map(s => ({ value: s, label: s }))
    ];

    if (showNewProjectForm) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setShowNewProjectForm(false)} className="back-button"><Icon name="back" /> Back to Projects List</Button>
                <ProjectForm onSubmit={handleCreateProject} onCancel={() => setShowNewProjectForm(false)} />
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h1>Projects Overview</h1>
                {canAccess(user.role, 'projects', 'create') && (
                    <Button onClick={() => setShowNewProjectForm(true)} className="button-primary"><Icon name="add" /> Create New Project</Button>
                )}
            </div>

            <div className="filter-panel">
                <h4>Filters</h4>
                <div className="flex-group">
                    <FormField
                        label="Search Project"
                        name="search"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        placeholder="Search by title, description, location"
                    />
                    <FormField
                        label="Filter by Status"
                        name="status"
                        type="select"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        options={projectStatusOptions}
                    />
                </div>
                {/* Saved filters will be implemented via a separate component/dialog */}
                {/* <Button className="button-outline">Saved Views <Icon name="settings" /></Button> */}
            </div>

            {filteredProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--secondary-color)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)' }}>No projects found matching your criteria.</p>
                    {canAccess(user.role, 'projects', 'create') && (
                        <Button onClick={() => setShowNewProjectForm(true)} className="button-primary"><Icon name="add" /> Create First Project</Button>
                    )}
                </div>
            ) : (
                <div className="card-grid">
                    {filteredProjects.map(project => (
                        <Card
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            status={project.status}
                            description={project.description}
                            onClick={() => navigate('ProjectDetail', { project, onUpdateProject: handleUpdateProject, onDeleteProject: handleDeleteProject })}
                            footer={
                                <div className="card-meta">
                                    <span>Budget: {formatCurrency(project.budget)}</span>
                                    <span>Start: {formatDate(project.startDate)}</span>
                                    <span>Beneficiaries: {project.beneficiariesImpacted}</span>
                                </div>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BeneficiaryForm = ({ beneficiary, onSubmit, onCancel, readOnly = false }) => {
    const { user } = useContext(AuthContext);
    const isEdit = !!beneficiary;
    const [formData, setFormData] = useState(beneficiary || {
        id: `b${DUMMY_DATA.beneficiaries.length + 1}`,
        name: '', project: '', supportType: '', status: 'Pending Enrollment', enrollmentDate: new Date().toISOString().split('T')[0],
        impactScore: null, location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.project || !formData.supportType || !formData.enrollmentDate) {
            alert('Please fill all required fields.');
            return;
        }
        onSubmit(formData);
    };

    const projects = DUMMY_DATA.projects.filter(p => p.status === 'Approved' || p.status === 'In Progress');

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>{isEdit ? (readOnly ? `View Beneficiary: ${formData.name}` : `Edit Beneficiary: ${formData.name}`) : 'Add New Beneficiary'}</h2>
            <form onSubmit={handleFormSubmit}>
                <FormField
                    label="Full Name" name="name" value={formData.name} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                    placeholder="e.g., John Doe"
                />
                <FormField
                    label="Project" name="project" type="select" value={formData.project} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                    options={[
                        { value: '', label: 'Select Project' },
                        ...projects.map(p => ({ value: p.id, label: p.title }))
                    ]}
                />
                <div className="flex-group">
                    <FormField
                        label="Support Type" name="supportType" value={formData.supportType} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                        placeholder="e.g., Water Access, Digital Skills"
                    />
                    <FormField
                        label="Enrollment Date" name="enrollmentDate" type="date" value={formData.enrollmentDate} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                    />
                </div>
                <div className="flex-group">
                    <FormField
                        label="Status" name="status" type="select" value={formData.status} onChange={handleChange} required
                        readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Pending Enrollment', label: 'Pending Enrollment' },
                            { value: 'Inactive', label: 'Inactive' }
                        ]}
                    />
                    <FormField
                        label="Impact Score (0-100)" name="impactScore" type="number" value={formData.impactScore} onChange={handleChange} min="0" max="100"
                        readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                    />
                </div>
                <FormField
                    label="Location" name="location" value={formData.location} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'beneficiaries', 'edit')}
                    placeholder="e.g., Village A-1"
                />
                <div className="form-actions">
                    {!readOnly && (canAccess(user.role, 'beneficiaries', isEdit ? 'edit' : 'create')) && (
                        <Button type="submit" className="button-primary">{isEdit ? 'Save Changes' : 'Add Beneficiary'}</Button>
                    )}
                    <Button type="button" onClick={onCancel} className="button-secondary">Cancel</Button>
                </div>
            </form>
        </div>
    );
};

const BeneficiaryDetail = ({ beneficiary, onUpdateBeneficiary, onDeleteBeneficiary }) => {
    const { user } = useContext(AuthContext);
    const { navigate, goBack } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);
    const [editMode, setEditMode] = useState(false);

    if (!beneficiary) return <div className="full-screen-view">Loading beneficiary details...</div>;

    const handleSave = (updatedBeneficiary) => {
        onUpdateBeneficiary(updatedBeneficiary);
        setEditMode(false);
        showToast('Beneficiary updated successfully!', 'success');
    };

    if (editMode) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setEditMode(false)} className="back-button"><Icon name="back" /> Back to Beneficiary Details</Button>
                <BeneficiaryForm beneficiary={beneficiary} onSubmit={handleSave} onCancel={() => setEditMode(false)} />
            </div>
        );
    }

    const project = DUMMY_DATA.projects.find(p => p.id === beneficiary.project);

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back to Beneficiaries</Button>
            <div className="section-header">
                <h1>{beneficiary.name} <span className="status-badge">{beneficiary.status}</span></h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {canAccess(user.role, 'beneficiaries', 'edit') && (user.role === 'Beneficiary' ? (user.id === beneficiary.id) : true) && (
                        <Button onClick={() => setEditMode(true)} className="button-primary"><Icon name="edit" /> Edit Beneficiary</Button>
                    )}
                    {canAccess(user.role, 'beneficiaries', 'delete') && (
                        <Button onClick={() => onDeleteBeneficiary(beneficiary.id)} className="button-danger" style={{ backgroundColor: 'var(--danger-color)' }}>Delete</Button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h3>Beneficiary Profile</h3>
                    <p><strong>Project:</strong> {project?.title || 'N/A'}</p>
                    <p><strong>Support Type:</strong> {beneficiary.supportType}</p>
                    <p><strong>Enrollment Date:</strong> {formatDate(beneficiary.enrollmentDate)}</p>
                    <p><strong>Location:</strong> {beneficiary.location}</p>
                    {beneficiary.impactScore && <p><strong>Impact Score:</strong> {beneficiary.impactScore}</p>}
                </div>
                <div>
                    <div className="chart-container" style={{ minHeight: 'auto' }}>
                        <h3>Progress Over Time <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Line Chart)</span></h3>
                        <div className="chart-placeholder">Line Chart: Impact Score Trend</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BeneficiariesList = () => {
    const { user } = useContext(AuthContext);
    const { navigate, showToast } = useContext(NavigationContext);
    const [beneficiaries, setBeneficiaries] = useState(DUMMY_DATA.beneficiaries);
    const [filters, setFilters] = useState({ status: 'All', search: '' });
    const [showNewBeneficiaryForm, setShowNewBeneficiaryForm] = useState(false);

    const handleUpdateBeneficiary = (updatedBeneficiary) => {
        setBeneficiaries(prev => prev.map(b => (b.id === updatedBeneficiary.id ? updatedBeneficiary : b)));
    };

    const handleDeleteBeneficiary = (beneficiaryId) => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            setBeneficiaries(prev => prev.filter(b => b.id !== beneficiaryId));
            navigate('Beneficiaries'); // Go back to list
            showToast('Beneficiary deleted successfully!', 'success');
        }
    };

    const handleCreateBeneficiary = (newBeneficiary) => {
        setBeneficiaries(prev => [...prev, newBeneficiary]);
        setShowNewBeneficiaryForm(false);
        showToast('Beneficiary added successfully!', 'success');
    };

    const filteredBeneficiaries = beneficiaries.filter(b => {
        const matchesRole = () => {
            if (user.role === 'Project Manager') return DUMMY_DATA.projects.some(p => p.id === b.project && p.manager === user.id);
            if (user.role === 'Beneficiary') return b.name.includes(user.name.split(' ')[1]);
            return true;
        };
        const matchesStatus = filters.status === 'All' || b.status === filters.status;
        const matchesSearch = b.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                              b.supportType.toLowerCase().includes(filters.search.toLowerCase()) ||
                              b.location.toLowerCase().includes(filters.search.toLowerCase());
        return matchesRole() && matchesStatus && matchesSearch;
    });

    const beneficiaryStatusOptions = [
        { value: 'All', label: 'All Statuses' },
        ...Array.from(new Set(DUMMY_DATA.beneficiaries.map(b => b.status))).map(s => ({ value: s, label: s }))
    ];

    if (showNewBeneficiaryForm) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setShowNewBeneficiaryForm(false)} className="back-button"><Icon name="back" /> Back to Beneficiaries List</Button>
                <BeneficiaryForm onSubmit={handleCreateBeneficiary} onCancel={() => setShowNewBeneficiaryForm(false)} />
            </div>
        );
    }

    return (
        <div>
            <div className="section-header">
                <h1>Beneficiaries</h1>
                {canAccess(user.role, 'beneficiaries', 'create') && (
                    <Button onClick={() => setShowNewBeneficiaryForm(true)} className="button-primary"><Icon name="add" /> Add New Beneficiary</Button>
                )}
            </div>

            <div className="filter-panel">
                <h4>Filters</h4>
                <div className="flex-group">
                    <FormField
                        label="Search Beneficiary"
                        name="search"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        placeholder="Search by name, support type, location"
                    />
                    <FormField
                        label="Filter by Status"
                        name="status"
                        type="select"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        options={beneficiaryStatusOptions}
                    />
                </div>
            </div>

            {filteredBeneficiaries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--secondary-color)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)' }}>No beneficiaries found matching your criteria.</p>
                    {canAccess(user.role, 'beneficiaries', 'create') && (
                        <Button onClick={() => setShowNewBeneficiaryForm(true)} className="button-primary"><Icon name="add" /> Add First Beneficiary</Button>
                    )}
                </div>
            ) : (
                <div className="card-grid">
                    {filteredBeneficiaries.map(beneficiary => (
                        <Card
                            key={beneficiary.id}
                            id={beneficiary.id}
                            title={beneficiary.name}
                            status={beneficiary.status}
                            description={`Project: ${DUMMY_DATA.projects.find(p => p.id === beneficiary.project)?.title || 'N/A'}`}
                            onClick={() => navigate('BeneficiaryDetail', { beneficiary, onUpdateBeneficiary: handleUpdateBeneficiary, onDeleteBeneficiary: handleDeleteBeneficiary })}
                            footer={
                                <div className="card-meta">
                                    <span>Support: {beneficiary.supportType}</span>
                                    <span>Location: {beneficiary.location}</span>
                                </div>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DonorsList = () => {
    const { user } = useContext(AuthContext);
    const { navigate } = useContext(NavigationContext);

    const filteredDonors = DUMMY_DATA.donors.filter(donor => {
        if (user.role === 'Donor') return donor.id === user.id; // Only self
        return true; // Admin/PM see all
    });

    return (
        <div>
            <h1>Donors</h1>
            <div className="card-grid">
                {filteredDonors.map(donor => (
                    <Card
                        key={donor.id}
                        id={donor.id}
                        title={donor.name}
                        status={donor.status}
                        description={`Contact: ${donor.contact}`}
                        onClick={() => navigate('DonorDetail', donor)}
                        footer={
                            <div className="card-meta">
                                <span>Total Donations: {formatCurrency(donor.totalDonations)}</span>
                                <span>Last Donation: {formatDate(donor.lastDonationDate)}</span>
                            </div>
                        }
                    />
                ))}
            </div>
        </div>
    );
};

const DonorForm = ({ donor, onSubmit, onCancel, readOnly = false }) => {
    const { user } = useContext(AuthContext);
    const isEdit = !!donor;
    const [formData, setFormData] = useState(donor || {
        id: `d${DUMMY_DATA.donors.length + 1}`,
        name: '', contact: '', status: 'Pending Verification', totalDonations: 0, lastDonationDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contact) {
            alert('Please fill all required fields.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>{isEdit ? `Edit Donor: ${formData.name}` : 'Add New Donor'}</h2>
            <form onSubmit={handleFormSubmit}>
                <FormField
                    label="Donor Name" name="name" value={formData.name} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'donors', 'edit')}
                />
                <FormField
                    label="Contact Email" name="contact" type="email" value={formData.contact} onChange={handleChange} required
                    readOnly={readOnly || !canAccess(user.role, 'donors', 'edit')}
                />
                <FormField
                    label="Status" name="status" type="select" value={formData.status} onChange={handleChange}
                    readOnly={readOnly || !canAccess(user.role, 'donors', 'edit')}
                    options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Pending Verification', label: 'Pending Verification' }
                    ]}
                />
                <div className="form-actions">
                    {!readOnly && (canAccess(user.role, 'donors', isEdit ? 'edit' : 'create')) && (
                        <Button type="submit" className="button-primary">{isEdit ? 'Save Changes' : 'Add Donor'}</Button>
                    )}
                    <Button type="button" onClick={onCancel} className="button-secondary">Cancel</Button>
                </div>
            </form>
        </div>
    );
};

const DonorDetail = ({ donor, onUpdateDonor, onDeleteDonor }) => {
    const { user } = useContext(AuthContext);
    const { navigate, goBack } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);
    const [editMode, setEditMode] = useState(false);

    if (!donor) return <div className="full-screen-view">Loading donor details...</div>;

    const handleSave = (updatedDonor) => {
        onUpdateDonor(updatedDonor);
        setEditMode(false);
        showToast('Donor updated successfully!', 'success');
    };

    if (editMode) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setEditMode(false)} className="back-button"><Icon name="back" /> Back to Donor Details</Button>
                <DonorForm donor={donor} onSubmit={handleSave} onCancel={() => setEditMode(false)} />
            </div>
        );
    }

    const donations = DUMMY_DATA.donations.filter(d => d.donorId === donor.id);

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back to Donors</Button>
            <div className="section-header">
                <h1>{donor.name} <span className="status-badge">{donor.status}</span></h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {canAccess(user.role, 'donors', 'edit') && (user.role === 'Donor' ? (user.id === donor.id) : true) && (
                        <Button onClick={() => setEditMode(true)} className="button-primary"><Icon name="edit" /> Edit Donor</Button>
                    )}
                    {canAccess(user.role, 'donors', 'delete') && (
                        <Button onClick={() => onDeleteDonor(donor.id)} className="button-danger" style={{ backgroundColor: 'var(--danger-color)' }}>Delete</Button>
                    )}
                </div>
            </div>

            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {donor.contact}</p>

            <h3>Donation History</h3>
            <p><strong>Total Donations:</strong> {formatCurrency(donor.totalDonations)}</p>
            <p><strong>Last Donation:</strong> {formatDate(donor.lastDonationDate)}</p>

            <h4 style={{ marginTop: 'var(--spacing-xl)' }}>All Donations from {donor.name}</h4>
            <div className="card-grid">
                {donations.length > 0 ? donations.map(donation => {
                    const project = DUMMY_DATA.projects.find(p => p.id === donation.projectId);
                    return (
                        <Card
                            key={donation.id}
                            id={donation.id}
                            title={`${formatCurrency(donation.amount)} to ${project?.title || 'N/A'}`}
                            status={donation.status}
                            description={`Type: ${donation.type}`}
                            onClick={() => navigate('DonationDetail', donation)}
                            footer={
                                <div className="card-meta">
                                    <span>Date: {formatDate(donation.date)}</span>
                                </div>
                            }
                        />
                    );
                }) : <p>No donations found for this donor.</p>}
            </div>
        </div>
    );
};


const VolunteersList = () => {
    const { user } = useContext(AuthContext);
    const { navigate } = useContext(NavigationContext);

    const filteredVolunteers = DUMMY_DATA.volunteers.filter(volunteer => {
        if (user.role === 'Volunteer') return volunteer.id === user.id; // Only self
        return true; // Admin/PM see all
    });

    return (
        <div>
            <h1>Volunteers</h1>
            <div className="card-grid">
                {filteredVolunteers.map(volunteer => (
                    <Card
                        key={volunteer.id}
                        id={volunteer.id}
                        title={volunteer.name}
                        status={volunteer.status}
                        description={`Skills: ${volunteer.skills.join(', ')}`}
                        onClick={() => navigate('VolunteerDetail', volunteer)}
                        footer={
                            <div className="card-meta">
                                <span>Assigned Projects: {volunteer.assignedProjects.length}</span>
                                <span>Hours Logged: {volunteer.hoursLogged}</span>
                            </div>
                        }
                    />
                ))}
            </div>
        </div>
    );
};

const VolunteerForm = ({ volunteer, onSubmit, onCancel, readOnly = false }) => {
    const { user } = useContext(AuthContext);
    const isEdit = !!volunteer;
    const [formData, setFormData] = useState(volunteer || {
        id: `v${DUMMY_DATA.volunteers.length + 1}`,
        name: '', email: '', status: 'Pending Approval', assignedProjects: [], hoursLogged: 0, skills: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'skills') {
            setFormData(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || formData.skills.length === 0) {
            alert('Please fill all required fields.');
            return;
        }
        onSubmit(formData);
    };

    const projectOptions = DUMMY_DATA.projects.map(p => ({ value: p.id, label: p.title }));

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>{isEdit ? `Edit Volunteer: ${formData.name}` : 'Add New Volunteer'}</h2>
            <form onSubmit={handleFormSubmit}>
                <FormField
                    label="Volunteer Name" name="name" value={formData.name} onChange={handleChange} required
                    readOnly={readOnly || (user.role === 'Volunteer' && user.id !== formData.id) || !canAccess(user.role, 'volunteers', 'edit')}
                />
                <FormField
                    label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required
                    readOnly={readOnly || (user.role === 'Volunteer' && user.id !== formData.id) || !canAccess(user.role, 'volunteers', 'edit')}
                />
                <FormField
                    label="Skills (comma-separated)" name="skills" value={formData.skills.join(', ')} onChange={handleChange} required
                    readOnly={readOnly || (user.role === 'Volunteer' && user.id !== formData.id) || !canAccess(user.role, 'volunteers', 'edit')}
                />
                {canAccess(user.role, 'volunteers', 'approve') && (
                    <FormField
                        label="Status" name="status" type="select" value={formData.status} onChange={handleChange}
                        readOnly={readOnly}
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                            { value: 'Pending Approval', label: 'Pending Approval' }
                        ]}
                    />
                )}
                {canAccess(user.role, 'volunteers', 'assign') && (
                    <FormField
                        label="Assigned Projects (multi-select placeholder)" name="assignedProjects" value={formData.assignedProjects} onChange={handleChange}
                        readOnly={readOnly} // Placeholder for multi-select
                        options={projectOptions}
                    />
                )}
                <FormField
                    label="Hours Logged" name="hoursLogged" type="number" value={formData.hoursLogged} onChange={handleChange} min="0"
                    readOnly={readOnly || (user.role === 'Volunteer' && user.id !== formData.id) || !canAccess(user.role, 'volunteers', 'edit_self')}
                />
                <div className="form-actions">
                    {!readOnly && (
                        ((user.role === 'Volunteer' && user.id === formData.id) && canAccess(user.role, 'volunteers', 'edit_self')) ||
                        (user.role !== 'Volunteer' && canAccess(user.role, 'volunteers', isEdit ? 'edit' : 'create'))
                    ) && (
                        <Button type="submit" className="button-primary">{isEdit ? 'Save Changes' : 'Add Volunteer'}</Button>
                    )}
                    <Button type="button" onClick={onCancel} className="button-secondary">Cancel</Button>
                </div>
            </form>
        </div>
    );
};


const VolunteerDetail = ({ volunteer, onUpdateVolunteer, onDeleteVolunteer }) => {
    const { user } = useContext(AuthContext);
    const { navigate, goBack } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);
    const [editMode, setEditMode] = useState(false);

    if (!volunteer) return <div className="full-screen-view">Loading volunteer details...</div>;

    const handleSave = (updatedVolunteer) => {
        onUpdateVolunteer(updatedVolunteer);
        setEditMode(false);
        showToast('Volunteer updated successfully!', 'success');
    };

    if (editMode) {
        return (
            <div className="full-screen-view">
                <Button onClick={() => setEditMode(false)} className="back-button"><Icon name="back" /> Back to Volunteer Details</Button>
                <VolunteerForm volunteer={volunteer} onSubmit={handleSave} onCancel={() => setEditMode(false)} />
            </div>
        );
    }

    const assignedProjects = DUMMY_DATA.projects.filter(p => volunteer.assignedProjects.includes(p.id));
    const assignedTasks = DUMMY_DATA.tasks.filter(t => t.assignedTo === volunteer.id);

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back to Volunteers</Button>
            <div className="section-header">
                <h1>{volunteer.name} <span className="status-badge">{volunteer.status}</span></h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {((user.role === 'Volunteer' && user.id === volunteer.id && canAccess(user.role, 'volunteers', 'edit_self')) ||
                      (user.role !== 'Volunteer' && canAccess(user.role, 'volunteers', 'edit'))) && (
                        <Button onClick={() => setEditMode(true)} className="button-primary"><Icon name="edit" /> Edit Volunteer</Button>
                    )}
                    {canAccess(user.role, 'volunteers', 'delete') && (
                        <Button onClick={() => onDeleteVolunteer(volunteer.id)} className="button-danger" style={{ backgroundColor: 'var(--danger-color)' }}>Delete</Button>
                    )}
                </div>
            </div>

            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {volunteer.email}</p>

            <h3>Skills & Contribution</h3>
            <p><strong>Skills:</strong> {volunteer.skills.join(', ')}</p>
            <p><strong>Hours Logged:</strong> {volunteer.hoursLogged}</p>

            <h4 style={{ marginTop: 'var(--spacing-xl)' }}>Assigned Projects</h4>
            <div className="card-grid">
                {assignedProjects.length > 0 ? assignedProjects.map(project => (
                    <Card
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        status={project.status}
                        description={project.description}
                        onClick={() => navigate('ProjectDetail', project)}
                        footer={
                            <div className="card-meta">
                                <span>Start: {formatDate(project.startDate)}</span>
                                <span>Manager: {DUMMY_DATA.users.find(u => u.id === project.manager)?.name || 'N/A'}</span>
                            </div>
                        }
                    />
                )) : <p>No projects currently assigned to this volunteer.</p>}
            </div>

            <h4 style={{ marginTop: 'var(--spacing-xl)' }}>Assigned Tasks</h4>
            <div className="card-grid">
                {assignedTasks.length > 0 ? assignedTasks.map(task => (
                    <Card
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        status={task.status}
                        description={task.description}
                        onClick={() => navigate('TaskDetail', task)}
                        footer={
                            <div className="card-meta">
                                <span>Project: {DUMMY_DATA.projects.find(p => p.id === task.projectId)?.title || 'N/A'}</span>
                                <span>Due: {formatDate(task.dueDate)}</span>
                            </div>
                        }
                    />
                )) : <p>No tasks currently assigned to this volunteer.</p>}
            </div>
        </div>
    );
};

const TaskDetail = ({ task, onUpdateTask, onDeleteTask }) => {
    const { user } = useContext(AuthContext);
    const { goBack } = useContext(NavigationContext);
    const { showToast } = useContext(ToastContext);
    const [editMode, setEditMode] = useState(false);

    if (!task) return <div className="full-screen-view">Loading task details...</div>;

    const handleSave = (updatedTask) => {
        onUpdateTask(updatedTask);
        setEditMode(false);
        showToast('Task updated successfully!', 'success');
    };

    const project = DUMMY_DATA.projects.find(p => p.id === task.projectId);
    const assignedVolunteer = DUMMY_DATA.volunteers.find(v => v.id === task.assignedTo);

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back</Button>
            <div className="section-header">
                <h1>{task.title} <span className="status-badge">{task.status}</span></h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    {((user.role === 'Volunteer' && user.id === task.assignedTo && canAccess(user.role, 'tasks', 'edit_status')) ||
                      (user.role === 'Project Manager' && canAccess(user.role, 'tasks', 'edit') && project?.manager === user.id) ||
                      (user.role === 'NGO Admin' && canAccess(user.role, 'tasks', 'edit'))) && (
                        <Button onClick={() => setEditMode(true)} className="button-primary"><Icon name="edit" /> Edit Task</Button>
                    )}
                    {canAccess(user.role, 'tasks', 'delete') && (
                        <Button onClick={() => onDeleteTask(task.id)} className="button-danger" style={{ backgroundColor: 'var(--danger-color)' }}>Delete</Button>
                    )}
                </div>
            </div>

            <h3>Task Details</h3>
            <p><strong>Project:</strong> {project?.title || 'N/A'}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Assigned To:</strong> {assignedVolunteer?.name || 'N/A'}</p>
            <p><strong>Due Date:</strong> {formatDate(task.dueDate)}</p>
            <p><strong>Priority:</strong> {task.priority}</p>

            {editMode && (
                <div style={{ maxWidth: '600px', margin: 'var(--spacing-xl) auto 0 auto', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--spacing-xl)' }}>
                    <h3>Edit Task Status</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave({ ...task, status: e.target.status.value });
                    }}>
                        <FormField
                            label="Status" name="status" type="select" value={task.status}
                            onChange={() => {}} // Controlled by form submit directly
                            options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Completed', label: 'Completed' },
                                { value: 'Blocked', label: 'Blocked' }
                            ]}
                            readOnly={!((user.role === 'Volunteer' && user.id === task.assignedTo && canAccess(user.role, 'tasks', 'edit_status')) ||
                                        (user.role === 'Project Manager' && canAccess(user.role, 'tasks', 'edit') && project?.manager === user.id) ||
                                        (user.role === 'NGO Admin' && canAccess(user.role, 'tasks', 'edit')))}
                        />
                        <div className="form-actions">
                            <Button type="submit" className="button-primary">Update Status</Button>
                            <Button type="button" onClick={() => setEditMode(false)} className="button-secondary">Cancel</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const DonationDetail = ({ donation }) => {
    const { goBack } = useContext(NavigationContext);

    if (!donation) return <div className="full-screen-view">Loading donation details...</div>;

    const donor = DUMMY_DATA.donors.find(d => d.id === donation.donorId);
    const project = DUMMY_DATA.projects.find(p => p.id === donation.projectId);

    return (
        <div className="full-screen-view">
            <Button onClick={goBack} className="back-button"><Icon name="back" /> Back</Button>
            <div className="section-header">
                <h1>Donation: {formatCurrency(donation.amount)} <span className="status-badge">{donation.status}</span></h1>
            </div>

            <h3>Donation Details</h3>
            <p><strong>Donor:</strong> {donor?.name || 'Anonymous'}</p>
            <p><strong>Project:</strong> {project?.title || 'N/A'}</p>
            <p><strong>Amount:</strong> {formatCurrency(donation.amount)}</p>
            <p><strong>Date:</strong> {formatDate(donation.date)}</p>
            <p><strong>Type:</strong> {donation.type}</p>
        </div>
    );
};

const Reports = () => {
    const { user } = useContext(AuthContext);
    if (!canAccess(user.role, 'reports')) {
        return <div className="full-screen-view">You do not have permission to view reports.</div>;
    }

    return (
        <div>
            <h1>Impact Reports</h1>
            <div className="chart-container">
                <h3>Overall Impact Score Trend <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Line Chart - Historical)</span></h3>
                <div className="chart-placeholder">Line Chart Placeholder for Impact Score</div>
            </div>
            <div className="chart-container">
                <h3>Fund Utilization by Project <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Bar Chart - Historical)</span></h3>
                <div className="chart-placeholder">Bar Chart Placeholder for Fund Utilization</div>
            </div>
            <div className="chart-container">
                <h3>Volunteer Hours Distribution <span style={{ float: 'right', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>(Donut Chart - Historical)</span></h3>
                <div className="chart-placeholder">Donut Chart Placeholder for Volunteer Hours</div>
            </div>
            <p style={{ marginTop: 'var(--spacing-xl)' }}>
                Reports can be exported to PDF/Excel. <Button className="button-secondary">Export to PDF</Button> <Button className="button-secondary">Export to Excel</Button>
            </p>
        </div>
    );
};

const Settings = () => {
    const { user } = useContext(AuthContext);
    if (!canAccess(user.role, 'settings')) {
        return <div className="full-screen-view">You do not have permission to access settings.</div>;
    }

    return (
        <div>
            <h1>Settings</h1>
            <p>User profile settings, system configurations, and other administrative options.</p>
            <p>This section is highly role-dependent for specific functionality.</p>
        </div>
    );
};

const AuditLogs = () => {
    const { user } = useContext(AuthContext);
    if (!canAccess(user.role, 'auditLogs', 'view')) {
        return <div className="full-screen-view">You do not have permission to view audit logs.</div>;
    }

    const logsToDisplay = DUMMY_DATA.auditLogs.filter(log => {
        if (user.role === 'Project Manager') {
            // PM can see logs related to their projects, beneficiaries, tasks
            const projectRelated = DUMMY_DATA.projects.some(p => p.id === log.resourceId && p.manager === user.id);
            const taskRelated = DUMMY_DATA.tasks.some(t => t.id === log.resourceId && DUMMY_DATA.projects.find(p => p.id === t.projectId)?.manager === user.id);
            const beneficiaryRelated = DUMMY_DATA.beneficiaries.some(b => b.id === log.resourceId && DUMMY_DATA.projects.find(p => p.id === b.project)?.manager === user.id);
            return projectRelated || taskRelated || beneficiaryRelated;
        }
        if (user.role === 'Volunteer') {
            // Volunteer sees logs related to their assigned tasks
            return DUMMY_DATA.tasks.some(t => t.id === log.resourceId && t.assignedTo === user.id);
        }
        if (user.role === 'Donor') {
            // Donor sees logs related to their donations
            return DUMMY_DATA.donations.some(d => d.id === log.resourceId && d.donorId === user.id);
        }
        if (user.role === 'Beneficiary') {
            // Beneficiary sees logs related to their own beneficiary record
            return DUMMY_DATA.beneficiaries.some(b => b.id === log.resourceId && b.name.includes(user.name.split(' ')[1]));
        }
        return true; // NGO Admin sees all
    });

    return (
        <div>
            <h1>Audit Logs</h1>
            <p>Immutable record of all system activities and changes.</p>
            <div className="data-grid">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Resource Type</th>
                        <th>Resource ID</th>
                    </tr>
                </thead>
                <tbody>
                    {logsToDisplay.map(log => (
                        <tr key={log.id}>
                            <td>{log.timestamp}</td>
                            <td>{DUMMY_DATA.users.find(u => u.id === log.user)?.name || 'N/A'}</td>
                            <td>{log.action}</td>
                            <td>{log.resourceType}</td>
                            <td>{log.resourceId}</td>
                        </tr>
                    ))}
                </tbody>
            </div>
        </div>
    );
};

const App = () => {
    const [user, setUser] = useState(null);
    const [screenHistory, setScreenHistory] = useState([{ name: 'Dashboard', data: null }]);
    const currentScreen = screenHistory[screenHistory.length - 1];
    const [toasts, setToasts] = useState([]);

    const login = (userData) => {
        setUser(userData);
        setScreenHistory([{ name: 'Dashboard', data: null }]);
    };

    const logout = () => {
        setUser(null);
        setScreenHistory([{ name: 'Dashboard', data: null }]);
    };

    const navigate = (screenName, data = null) => {
        setScreenHistory(prev => {
            const lastScreen = prev[prev.length - 1];
            // Prevent navigating to the exact same screen with the exact same data to avoid duplicates in history
            if (lastScreen && lastScreen.name === screenName && JSON.stringify(lastScreen.data) === JSON.stringify(data)) {
                return prev;
            }
            return [...prev, { name: screenName, data }];
        });
    };

    const goBack = () => {
        if (screenHistory.length > 1) {
            setScreenHistory(prev => prev.slice(0, -1));
        }
    };

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const renderScreen = () => {
        if (!user) {
            return <LoginForm />;
        }

        const { name, data } = currentScreen;

        // Render full-screen views
        if (name === 'ProjectDetail' && data) {
            return <ProjectDetail project={data.project} onUpdateProject={data.onUpdateProject} onDeleteProject={data.onDeleteProject} />;
        }
        if (name === 'BeneficiaryDetail' && data) {
            return <BeneficiaryDetail beneficiary={data.beneficiary} onUpdateBeneficiary={data.onUpdateBeneficiary} onDeleteBeneficiary={data.onDeleteBeneficiary} />;
        }
        if (name === 'DonorDetail' && data) {
            const handleUpdateDonor = (updatedDonor) => {
                DUMMY_DATA.donors = DUMMY_DATA.donors.map(d => (d.id === updatedDonor.id ? updatedDonor : d));
                navigate('DonorDetail', { ...updatedDonor }); // Update current screen data
            };
            const handleDeleteDonor = (donorId) => {
                DUMMY_DATA.donors = DUMMY_DATA.donors.filter(d => d.id !== donorId);
                goBack();
                showToast('Donor deleted successfully!', 'success');
            };
            return <DonorDetail donor={data} onUpdateDonor={handleUpdateDonor} onDeleteDonor={handleDeleteDonor} />;
        }
        if (name === 'VolunteerDetail' && data) {
            const handleUpdateVolunteer = (updatedVolunteer) => {
                DUMMY_DATA.volunteers = DUMMY_DATA.volunteers.map(v => (v.id === updatedVolunteer.id ? updatedVolunteer : v));
                navigate('VolunteerDetail', { ...updatedVolunteer });
            };
            const handleDeleteVolunteer = (volunteerId) => {
                DUMMY_DATA.volunteers = DUMMY_DATA.volunteers.filter(v => v.id !== volunteerId);
                goBack();
                showToast('Volunteer deleted successfully!', 'success');
            };
            return <VolunteerDetail volunteer={data} onUpdateVolunteer={handleUpdateVolunteer} onDeleteVolunteer={handleDeleteVolunteer} />;
        }
        if (name === 'TaskDetail' && data) {
            const handleUpdateTask = (updatedTask) => {
                DUMMY_DATA.tasks = DUMMY_DATA.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
                navigate('TaskDetail', { ...updatedTask });
            };
            const handleDeleteTask = (taskId) => {
                DUMMY_DATA.tasks = DUMMY_DATA.tasks.filter(t => t.id !== taskId);
                goBack();
                showToast('Task deleted successfully!', 'success');
            };
            return <TaskDetail task={data} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />;
        }
        if (name === 'DonationDetail' && data) {
            return <DonationDetail donation={data} />;
        }

        // Main content screens (rendered inside main-content div)
        return (
            <div className="main-content">
                {name === 'Dashboard' && canAccess(user.role, 'dashboard') && <Dashboard />}
                {name === 'Projects' && canAccess(user.role, 'projects', 'view') && <ProjectsList />}
                {name === 'Beneficiaries' && canAccess(user.role, 'beneficiaries', 'view') && <BeneficiariesList />}
                {name === 'Donors' && canAccess(user.role, 'donors', 'view') && <DonorsList />}
                {name === 'Volunteers' && canAccess(user.role, 'volunteers', 'view') && <VolunteersList />}
                {name === 'Reports' && canAccess(user.role, 'reports') && <Reports />}
                {name === 'Settings' && canAccess(user.role, 'settings') && <Settings />}
                {name === 'AuditLogs' && canAccess(user.role, 'auditLogs', 'view') && <AuditLogs />}
                {/* Default or unauthorized screen */}
                {!canAccess(user.role, name.toLowerCase()) && <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>You do not have permission to view this section.</div>}
            </div>
        );
    };

    if (!user) {
        return <AuthContext.Provider value={{ user, login, logout }}><LoginForm /></AuthContext.Provider>;
    }

    const currentScreenIsFullScreen = ['ProjectDetail', 'BeneficiaryDetail', 'DonorDetail', 'VolunteerDetail', 'TaskDetail', 'DonationDetail'].includes(currentScreen.name);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <NavigationContext.Provider value={{ navigate, goBack, showToast }}>
                <ToastContext.Provider value={{ showToast }}>
                    <div className="app-container">
                        <header className="header">
                            <h1>SevaConnect <span>{user.role} Dashboard</span></h1>
                            <div className="header-actions">
                                <div className="global-search">
                                    <input type="text" placeholder="Global Search..." /><Icon name="search" />
                                </div>
                                <Button className="button-icon"><Icon name="bell" /></Button>
                                <div className="user-profile">
                                    <div className="user-avatar">{user.name.charAt(0)}</div>
                                    <span>{user.name}</span>
                                </div>
                            </div>
                        </header>
                        <aside className="sidebar">
                            <h2>SevaConnect</h2>
                            <nav>
                                <ul>
                                    {canAccess(user.role, 'dashboard') && (
                                        <li><a href="#" onClick={() => navigate('Dashboard')} className={currentScreen.name === 'Dashboard' ? 'active' : ''}><Icon name="dashboard" /> Dashboard</a></li>
                                    )}
                                    {canAccess(user.role, 'projects', 'view') && (
                                        <li><a href="#" onClick={() => navigate('Projects')} className={currentScreen.name === 'Projects' ? 'active' : ''}><Icon name="projects" /> Projects</a></li>
                                    )}
                                    {canAccess(user.role, 'beneficiaries', 'view') && (
                                        <li><a href="#" onClick={() => navigate('Beneficiaries')} className={currentScreen.name === 'Beneficiaries' ? 'active' : ''}><Icon name="beneficiaries" /> Beneficiaries</a></li>
                                    )}
                                    {canAccess(user.role, 'donors', 'view') && (
                                        <li><a href="#" onClick={() => navigate('Donors')} className={currentScreen.name === 'Donors' ? 'active' : ''}><Icon name="donors" /> Donors</a></li>
                                    )}
                                    {canAccess(user.role, 'volunteers', 'view') && (
                                        <li><a href="#" onClick={() => navigate('Volunteers')} className={currentScreen.name === 'Volunteers' ? 'active' : ''}><Icon name="volunteers" /> Volunteers</a></li>
                                    )}
                                    {canAccess(user.role, 'reports') && (
                                        <li><a href="#" onClick={() => navigate('Reports')} className={currentScreen.name === 'Reports' ? 'active' : ''}><Icon name="reports" /> Reports</a></li>
                                    )}
                                    {canAccess(user.role, 'auditLogs', 'view') && (
                                        <li><a href="#" onClick={() => navigate('AuditLogs')} className={currentScreen.name === 'AuditLogs' ? 'active' : ''}><Icon name="audit" /> Audit Logs</a></li>
                                    )}
                                    {canAccess(user.role, 'settings') && (
                                        <li><a href="#" onClick={() => navigate('Settings')} className={currentScreen.name === 'Settings' ? 'active' : ''}><Icon name="settings" /> Settings</a></li>
                                    )}
                                    <li><a href="#" onClick={logout}><Icon name="logout" /> Logout</a></li>
                                </ul>
                            </nav>
                        </aside>
                        {renderScreen()}
                    </div>
                    <div className="toast-container">
                        {toasts.map(toast => (
                            <Toast key={toast.id} {...toast} onClose={removeToast} />
                        ))}
                    </div>
                </ToastContext.Provider>
            </NavigationContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;