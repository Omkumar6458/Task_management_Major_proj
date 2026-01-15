package com.example.taskmanagement.service;

import com.example.taskmanagement.Notification.NotificationService;
import com.example.taskmanagement.dto.TaskRequest;
import com.example.taskmanagement.dto.TaskResponse;
import com.example.taskmanagement.dto.UserResponse;
import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.entity.User;
import com.example.taskmanagement.exception.ResourceNotFoundException;
import com.example.taskmanagement.exception.UnauthorizedException;
import com.example.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    
    
    @Autowired
    private NotificationService notificationService;


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    public TaskResponse createTask(TaskRequest request) {
        User currentUser = getCurrentUser();

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCreatedBy(currentUser);


        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            task.setAssignedTo(assignedUser);
        }
        
        
        
        User assignedUser = null;

        if (request.getAssignedToId() != null) {
            assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + request.getAssignedToId()));
            task.setAssignedTo(assignedUser);
        }

        Task savedTask = taskRepository.save(task);

        // 🔔 SEND NOTIFICATION
        if (assignedUser != null) {
            notificationService.sendTaskAssignedNotification(
                assignedUser,
                savedTask
            );
        }

        return mapToResponse(savedTask);


        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }
    
    */
    
    
    public TaskResponse createTask(TaskRequest request) {

        // 1️⃣ Get currently logged-in user
        User currentUser = getCurrentUser();

        // 2️⃣ Create Task entity
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setCreatedBy(currentUser);

        // 3️⃣ Assign user if provided
        User assignedUser = null;
        if (request.getAssignedToId() != null) {
            assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found with id: " + request.getAssignedToId()
                            )
                    );
            task.setAssignedTo(assignedUser);
        }

        // 4️⃣ Save task
        Task savedTask = taskRepository.save(task);

        // 5️⃣ Send notification ONLY if task is assigned
        if (assignedUser != null) {
            notificationService.sendTaskAssignedNotification(
                    assignedUser,
                    savedTask
            );
        }

        // 6️⃣ Convert entity → response DTO
        return mapToResponse(savedTask);
    }

    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    public List<TaskResponse> getAllTasks(Integer page, Integer size, String sortBy) {
        User currentUser = getCurrentUser();
        
        Pageable pageable = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 10,
                Sort.by(sortBy != null ? sortBy : "createdAt").descending()
        );

        Page<Task> tasks;
        
        // Admins can see all tasks, users can only see their tasks
        if (isAdmin(currentUser)) {
            tasks = taskRepository.findAll(pageable);
        } else {
            tasks = taskRepository.findByCreatedBy(currentUser, pageable);
        }

        return tasks.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = getCurrentUser();
        
        // Check if user has permission to view this task
        if (!isAdmin(currentUser) && !task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to view this task");
        }

        return mapToResponse(task);
    }

    
    
    /*
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = getCurrentUser();

        // Check if user has permission to update this task
        if (!isAdmin(currentUser) && !task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());

        // Update assigned user if provided
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            task.setAssignedTo(assignedUser);
        } else {
            task.setAssignedTo(null);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }
*/
    
    public TaskResponse updateTask(Long id, TaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));

        User currentUser = getCurrentUser();

        if (!isAdmin(currentUser) &&
            !task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }

        // 🔴 STEP 6.1 — STORE PREVIOUS ASSIGNED USER
        User previousAssignedUser = task.getAssignedTo();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());

        // 🔴 STEP 6.2 — SET NEW ASSIGNED USER
        if (request.getAssignedToId() != null) {
            User newAssignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + request.getAssignedToId()));
            task.setAssignedTo(newAssignedUser);
        } else {
            task.setAssignedTo(null);
        }

        // 🔴 STEP 6.3 — SAVE TASK
        Task updatedTask = taskRepository.save(task);

        // 🔴 STEP 6.4 — SEND NOTIFICATION ONLY IF ASSIGNMENT CHANGED
        if (updatedTask.getAssignedTo() != null &&
            (previousAssignedUser == null ||
             !previousAssignedUser.getId().equals(
                     updatedTask.getAssignedTo().getId()))) {

            notificationService.sendTaskAssignedNotification(
                    updatedTask.getAssignedTo(),
                    updatedTask
            );
        }

        return mapToResponse(updatedTask);
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = getCurrentUser();

        // Only admins can delete tasks
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only administrators can delete tasks");
        }

        taskRepository.delete(task);
    }

    public List<TaskResponse> getMyTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByCreatedBy(currentUser);
        
        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isAdmin(User user) {
        return user.getRole() == User.Role.ADMIN;
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        if (task.getCreatedBy() != null) {
            response.setCreatedBy(mapToUserResponse(task.getCreatedBy()));
        }

        if (task.getAssignedTo() != null) {
            response.setAssignedTo(mapToUserResponse(task.getAssignedTo()));
        }

        return response;
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
