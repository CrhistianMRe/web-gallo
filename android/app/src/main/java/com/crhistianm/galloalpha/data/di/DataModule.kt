package com.crhistianm.galloalpha.data.di

import android.util.JsonToken
import com.crhistianm.galloalpha.data.datasource.api.WorkoutApiService
import com.crhistianm.galloalpha.data.repository.WorkoutRepository
import com.crhistianm.galloalpha.data.repository.WorkoutRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

@Module
@InstallIn(SingletonComponent::class)
object DataModule {

    @Provides
    fun provideWorkoutRepository(api: WorkoutApiService): WorkoutRepository {
        return WorkoutRepositoryImpl(api)
    }

    @Provides
    fun provideWorkoutApiService(retrofit: Retrofit): WorkoutApiService {
        return retrofit.create(WorkoutApiService::class.java)
    }

    @Provides
    fun provideRetrofit(json: Json): Retrofit {
        return Retrofit
            .Builder()
            .baseUrl("http:10.0.2.2:3000/")
            .addConverterFactory(json.asConverterFactory("application/json; charset=UTF8".toMediaType()))
            .build()
    }

    @Provides
    fun provideJson(): Json{
        return Json{
            ignoreUnknownKeys = true
            isLenient = true
        }
    }

}