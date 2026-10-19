package com.example.demo.service;

import com.example.demo.dto.AnonymityResponse;
import com.example.demo.model.Review;
import com.example.demo.model.ReviewAnonymity;
import com.example.demo.repository.ReviewAnonymityRepository;
import com.example.demo.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReviewAnonymityServiceTest {

    ReviewRepository reviewRepo;
    ReviewAnonymityRepository anonRepo;
    ReviewAnonymityService service;

    @BeforeEach
    void setUp() {
        reviewRepo = mock(ReviewRepository.class);
        anonRepo = mock(ReviewAnonymityRepository.class);
        when(anonRepo.save(any(ReviewAnonymity.class))).thenAnswer(i -> i.getArgument(0));
        service = new ReviewAnonymityService(reviewRepo, anonRepo);
    }

    private void givenReviewOwnedBy(int ownerId) {
        Review r = new Review(ownerId, 1, 4, "ok");
        r.setReviewId(10);
        when(reviewRepo.findById(10)).thenReturn(Optional.of(r));
        when(reviewRepo.existsById(10)).thenReturn(true);
        when(anonRepo.findById(10)).thenReturn(Optional.empty());
    }

    @Test
    void TC_33_1_newEntity_defaultsToAnonymous() {
        assertTrue(new ReviewAnonymity().isAnonymous());
    }

    @Test
    void TC_33_2_anonymousEntity_clearsAuthorNameBeforeSave() {
        ReviewAnonymity a = new ReviewAnonymity();
        a.setAnonymous(true);
        a.setAuthorName("Somchai");
        a.normalizeAuthorName();
        assertNull(a.getAuthorName());
    }

    @Test
    void TC_23_1_owner_canShowName_andOwnerIsStored() {
        givenReviewOwnedBy(7);

        AnonymityResponse res = service.setAnonymity("7", 10, false, "Suphaphit P.");

        ArgumentCaptor<ReviewAnonymity> cap = ArgumentCaptor.forClass(ReviewAnonymity.class);
        verify(anonRepo).save(cap.capture());
        assertEquals(7, cap.getValue().getOwnerUserId());
        assertFalse(cap.getValue().isAnonymous());
        assertEquals("Suphaphit P.", cap.getValue().getAuthorName());
        assertFalse(res.anonymous());
        assertEquals("Suphaphit P.", res.displayName());
    }

    @Test
    void TC_23_2_owner_canHideAgain_andNameIsCleared() {
        givenReviewOwnedBy(7);
        ReviewAnonymity existing = new ReviewAnonymity();
        existing.setReviewId(10);
        existing.setOwnerUserId(7L);
        existing.setAnonymous(false);
        existing.setAuthorName("Suphaphit P.");
        when(anonRepo.findById(10)).thenReturn(Optional.of(existing));

        AnonymityResponse res = service.setAnonymity("7", 10, true, null);

        assertTrue(res.anonymous());
        assertEquals("Anonymous", res.displayName());
        assertNull(existing.getAuthorName());
    }

    @Test
    void TC_23_3_otherUser_gets403_andNothingSaved() {
        givenReviewOwnedBy(7);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.setAnonymity("8", 10, false, "Other"));

        assertEquals(HttpStatus.FORBIDDEN.value(), ex.getStatusCode().value());
        verify(anonRepo, never()).save(any());
    }

    @Test
    void TC_23_4_reviewNotFound_gets404() {
        when(reviewRepo.findById(99)).thenReturn(Optional.empty());
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.setAnonymity("7", 99, true, null));
        assertEquals(HttpStatus.NOT_FOUND.value(), ex.getStatusCode().value());
    }

    @Test
    void TC_23_5_showName_withBlankName_usesDefault() {
        givenReviewOwnedBy(7);
        AnonymityResponse res = service.setAnonymity("7", 10, false, "  ");
        assertEquals("TU Student", res.displayName());
    }

    @Test
    void TC_23_6_noRowYet_isTreatedAsAnonymous() {
        givenReviewOwnedBy(7);
        AnonymityResponse res = service.getAnonymity(10);
        assertTrue(res.anonymous());
        assertEquals("Anonymous", res.displayName());
    }

    @Test
    void TC_25_1_response_hasNoUserId() {
        boolean hasUserId = Arrays.stream(AnonymityResponse.class.getRecordComponents())
                .anyMatch(c -> c.getName().equalsIgnoreCase("userId")
                        || c.getName().equalsIgnoreCase("ownerUserId"));
        assertFalse(hasUserId);
    }
}
