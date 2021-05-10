import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { useEffect, useState } from 'react';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import UserProfile from '../UserProfile/UserProfile';

function ViewUsers() {
    const [users, setUsers] = useState([]);

    const [showOnlyTutorRequests, setShowOnlyTutorRequests] = useState(false);

    const [columns, setColumns] = useState([]);

    const [userToView, setUserToView] = useState({});

    const [showDialog, setShowDialog] = useState(false);

    const allColumns = [
        { field: 'username', header: 'Username' },
        { field: 'name', header: 'Name' },
        { field: 'userType', header: 'User Type' },
        { field: 'active', header: 'Active' },
        { field: 'listedAsTutor', header: 'Tutor' },
        { field: 'userActions', header: '' },
    ];
    const pendingRequestColumns = [
        { field: 'username', header: 'Username' },
        { field: 'name', header: 'Name' },
        { field: 'cvLink', header: 'CV' },
        { field: 'actions', header: '' },
    ];

    useEffect(() => {
        setColumns(allColumns);
        fetchUsers();
    }, []);

    const showPendingTutorRequests = (toggle) => {
        setShowOnlyTutorRequests(toggle.value);
        if (toggle.value) {
            fetchUsers({ listedAsTutor: false, appliedAsTutor: true });
            setColumns(pendingRequestColumns);
        } else {
            fetchUsers();
            setColumns(allColumns);
        }
    };

    const fetchUsers = (data) => {
        httpService.getRequest(URLS.USERS, data).subscribe((data) => {
            if (data) {
                setUsers(data);
            }
        });
    };

    const changeActiveUser = (rowData, active) => {
        httpService.putRequest(URLS.USERS, { ...rowData, active }).subscribe((d) => {
            const index = users.findIndex((u) => u.username === rowData.username);
            const tempUsers = [...users];
            tempUsers[index] = { ...rowData, active };
            setUsers(tempUsers);
        });
    };

    const userTypeTemplate = (row) => {
        const type = row.userType === 0 ? 'Student' : 'Admin';
        return <span className={`user-type-badge user-type-${type.toLowerCase()}`}>{type}</span>;
    };

    const viewUser = (row) => {
        setUserToView(row);
        setShowDialog(true);
    };

    const requestActionsTemplate = (row) => {
        return (
            <div className="btn-group" role="group" aria-label="Actions">
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => {
                        showConfirmationDialog(row, 'accept');
                    }}
                >
                    <i className="pi pi-check-circle"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                        viewUser(row);
                    }}
                >
                    <i className="pi pi-eye"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                        showConfirmationDialog(row, 'reject');
                    }}
                >
                    <i className="pi pi-times-circle"></i>
                </button>
            </div>
        );
    };

    const showConfirmationDialog = (rowData, type) => {
        const message =
            type === 'delete'
                ? `delete ${rowData.name} from Users?`
                : type === 'accept'
                ? `accept ${rowData.name} as tutor?`
                : `reject ${rowData.name}'s application for tutor?`;
        confirmDialog({
            message: `Are you sure to ${message}`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                switch (type) {
                    case 'delete':
                        deleteUser(rowData);
                        break;
                    case 'accept':
                        acceptRejectRequest(rowData, true);
                        break;
                    case 'reject':
                        acceptRejectRequest(rowData, false);
                        break;
                    default:
                        break;
                }
            },
            reject: () => {},
        });
    };

    const deleteUser = (user) => {
        httpService.deleteRequest(URLS.USERS, user).subscribe((data) => {
            fetchUsers();
        });
    };

    const userActionsTemplate = (row) => {
        return (
            <div className="btn-group" role="group" aria-label="Actions">
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                        viewUser(row);
                    }}
                >
                    <i className="pi pi-eye"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                        showConfirmationDialog(row, 'delete');
                    }}
                >
                    <i className="pi pi-trash"></i>
                </button>
            </div>
        );
    };

    const acceptRejectRequest = (row, accept) => {
        const data = {
            username: row.username,
        };
        if (accept) {
            data.listedAsTutor = true;
        } else {
            data.appliedAsTutor = false;
        }
        httpService.putRequest(URLS.USERS, data).subscribe((d) => {
            showPendingTutorRequests({ value: true });
        });
    };

    const listedAsTutorTemplate = (row) => {
        const classes = row.listedAsTutor
            ? 'check-circle listed-tutor'
            : row.appliedAsTutor
            ? 'exclamation-circle applied-tutor'
            : 'times-circle not-tutor';
        return <span className={`tutor-status pi pi-${classes}`}></span>;
    };

    const activeStatusTemplate = (row) => {
        return <InputSwitch checked={row.active} onChange={(e) => changeActiveUser(row, e.value)} />;
    };

    const cvLinkTemplate = (row) => {
        return (
            <a href={row.cvLink} target="_blank" rel="noreferrer">
                <button className="btn primary-button">Download CV</button>
            </a>
        );
    };

    const dynamicColumns = columns.map((col, i) => {
        if (col.field === 'active') {
            return <Column key={col.field} field={col.field} header={col.header} body={activeStatusTemplate} />;
        } else if (col.field === 'userType') {
            return (
                <Column
                    filterPlaceholder={'Search By ' + col.header}
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={userTypeTemplate}
                />
            );
        } else if (col.field === 'listedAsTutor') {
            return <Column key={col.field} field={col.field} header={col.header} body={listedAsTutorTemplate} />;
        } else if (col.field === 'cvLink') {
            return <Column key={col.field} field={col.field} header={col.header} body={cvLinkTemplate} />;
        } else if (col.field === 'actions') {
            return <Column key={col.field} field={col.field} header={col.header} body={requestActionsTemplate} />;
        } else if (col.field === 'userActions') {
            return <Column key={col.field} field={col.field} header={col.header} body={userActionsTemplate} />;
        } else {
            return (
                <Column
                    filterPlaceholder={'Search By ' + col.header}
                    key={col.field}
                    field={col.field}
                    header={col.header}
                />
            );
        }
    });

    return (
        <div className="view-user-component">
            <div className="app-card">
                <div className="users-filters-div">
                    <div className="single-filter col-md-4">
                        <p className="filter-heading center bold">Show Pending Tutor Requests</p>
                        <InputSwitch checked={showOnlyTutorRequests} onChange={showPendingTutorRequests} />
                    </div>
                </div>
            </div>
            <div className="app-card">
                <div className="users-table">
                    <DataTable paginator rows={5} value={users}>
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>

            <Dialog
                visible={showDialog}
                onHide={() => {
                    setShowDialog(false);
                }}
                className="col-md-4 col-sm-12"
            >
                <UserProfile user={userToView}></UserProfile>
            </Dialog>
        </div>
    );
}

export default ViewUsers;
