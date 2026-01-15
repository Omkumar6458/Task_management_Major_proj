package com.example.taskmanagement.Notification;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.taskmanagement.entity.Task;
import com.example.taskmanagement.entity.User;


@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public void sendTaskAssignedNotification(User user, Task task) {

        Notification notification = new Notification();
        notification.setUserEmail(user.getEmail());
        notification.setMessage("New task assigned: " + task.getTitle());
        notification.setRead(false);

        // 🔴 LINK NOTIFICATION TO TASK
        notification.setTask(task);

        repository.save(notification);
    }

    
    public List<Notification> getUserNotifications(String email) {
        return repository.findByUserEmailOrderByCreatedAtDesc(email);
    }

}
