package com.ucieda.backend;

import com.ucieda.backend.shared.GenericResponse;
import com.ucieda.backend.user.User;
import com.ucieda.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {

    public static final String API_1_0_USERS = "/api/1.0/users";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void cleanup(){
        userRepository.deleteAll();
    }

    @Test
    public void postUser_whenUserIsValid_receiveOk(){
        User user = createUser();
        ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
        assertThat(response.getStatusCode() , equalTo(HttpStatus.OK));
    }

    @Test
    public void postUser_whenUserIsValid_receiveOkSuccessMessage(){
        User user = createUser();
        ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
        assertThat(response.getBody().getMessage() , notNullValue());
    }

    @Test
    public void postUser_whenUserIsValid_passwordIsHashedInDatabase(){
        User user = createUser();
        testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
        List<User> users = userRepository.findAll();
        User inDB = users.get(0);
        assertThat(inDB.getPassword(), not(user.getPassword()));
    }

    private User createUser() {
        User user = new User();
        user.setUsername("test-user");
        user.setDisplayName("test-display");
        user.setPassword("P4ssword");
        return user;
    }

    @Test
    public void postUser_whenUserIsValid_userSavedToDatabase(){
        User user = createUser();
        testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
        assertThat(userRepository.count() , equalTo(1L));
    }
}
