// 1=read,2:read/write,3:read/write/del,0:not show

export const ovdmanage = {
    roles: [
        {
            roleType: 'Admin',
            role:1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                all_companies:3,
                manage_users:3,
                consultant_managers:3,
                consultants:3,
                contractors:3,
                customers:3,
                all_quotes:3,
                all_projects:3,
                all_tags:3,
                all_commisions:3,
                change_password:3
            },
        },
        {
            roleType: 'Consultant Manager',
            role:1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                all_companies:1,
                manage_users:3,
                consultants:3,
                contractors:3,
                customers:3,
                all_quotes:3,
                all_projects:3,
                all_tags:3,
                all_commisions:1,
                change_password:3
            },
        },
        {
            roleType: 'Consultant',
            role:1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                manage_users:3,
                customers: 3,
                all_companies:1,
                all_quotes:3,
                all_projects:3,
                all_tags:3,
                all_commisions:1,
                change_password:3
            }
        },
        {
            roleType: 'Contractor',
            role: 1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                all_companies:1,
                all_projects:1,
                all_tags:3,
                change_password:3
            }
        },
        {
            roleType: 'Customer',
            role: 1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                all_projects:1,
                profile: 2,
                change_password:3
            }
        },
        {
            roleType: 'IntDesign',
            role:1,
            permissions: {
                home:3,
                active_projects:3,
                projects_nearing_deadline:3,
                tasks_nearing_deadline:3,
                recent_completed_tasks:3,
                manage_users:3,
                customers: 3,
                all_companies:1,
                all_quotes:3,
                all_projects:3,
                all_tags:3,
                all_commisions:1,
                change_password:3
            }
        }
    ]
};

