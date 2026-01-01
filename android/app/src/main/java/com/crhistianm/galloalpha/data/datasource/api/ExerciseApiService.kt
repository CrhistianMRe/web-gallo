package com.crhistianm.galloalpha.data.datasource.api

import com.crhistianm.galloalpha.data.response.ExerciseResponse
import retrofit2.http.GET

interface ExerciseApiService {

    @GET("exercises")
    suspend fun getAll(): List<ExerciseResponse>

}