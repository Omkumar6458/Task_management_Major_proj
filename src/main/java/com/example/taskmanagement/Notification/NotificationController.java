package com.example.taskmanagement.Notification;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanagement.entity.User;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notification> myNotifications() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email;

        Object principal = authentication.getPrincipal();

        if (principal instanceof User) {
            email = ((User) principal).getEmail();
        } else {
            // fallback (JWT username case)
            email = authentication.getName();
        }

        return service.getUserNotifications(email);
    }
}
