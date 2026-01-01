package com.crhistianm.galloalpha.data.repository

import com.crhistianm.galloalpha.data.datasource.api.ExerciseApiService
import com.crhistianm.galloalpha.data.response.ExerciseResponse
import javax.inject.Inject

class ExerciseRepositoryImpl @Inject constructor(val api: ExerciseApiService): ExerciseRepository{

    override suspend fun findAll(): List<ExerciseResponse> {
        return api.getAll()
    }

}