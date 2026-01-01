package com.crhistianm.galloalpha.data.repository

import com.crhistianm.galloalpha.data.response.ExerciseResponse

interface ExerciseRepository {
    suspend fun findAll(): List<ExerciseResponse>
}