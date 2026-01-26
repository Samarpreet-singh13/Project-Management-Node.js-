export const UserRoleEnum={
    ADMIN: "admin",
    PROJECT_ADMIN:"project-admin",
    MEMBER:"member"
}
export const AvailableUser=Object.values(UserRoleEnum);

export const TaskStatusEnum={
    TODO:"todo",
    IN_PROGRESS:"inprogress",
    DONE:"done"
}

export const AvailableTaskStatus=Object.values(TaskStatusEnum);         