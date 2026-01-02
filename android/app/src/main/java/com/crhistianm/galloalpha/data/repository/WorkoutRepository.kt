package com.crhistianm.galloalpha.data.repository

import com.crhistianm.galloalpha.data.response.WorkoutResponse

interface WorkoutRepository {
    suspend fun findAll(): List<WorkoutResponse>
}