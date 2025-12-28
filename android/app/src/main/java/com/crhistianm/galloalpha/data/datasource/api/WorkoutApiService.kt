package com.crhistianm.galloalpha.data.datasource.api

import com.crhistianm.galloalpha.data.response.WorkoutResponse
import retrofit2.http.GET

interface WorkoutApiService{

    @GET("workouts")
    suspend fun viewAll():List<WorkoutResponse>
}
