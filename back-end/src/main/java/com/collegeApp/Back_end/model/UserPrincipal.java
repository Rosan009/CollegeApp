package com.collegeApp.back_end.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())); // Fix: Prefix with ROLE_
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return user != null && user.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return user != null && user.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return user != null && user.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return user != null && user.isEnabled();
    }
}
