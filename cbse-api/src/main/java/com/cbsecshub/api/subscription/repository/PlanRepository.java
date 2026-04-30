package com.cbsecshub.api.subscription.repository;

import com.cbsecshub.api.subscription.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findAllByIsActiveTrueOrderByPriceInrAsc();
}
