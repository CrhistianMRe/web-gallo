package com.crhistianm.galloalpha.view.core.components

import android.R
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GalloTopAppBar(title: String, navigationIcon: @Composable () -> Unit, actions: @Composable () -> Unit) {

    CenterAlignedTopAppBar(
        title = {
            Text(
                modifier = Modifier
                    .width(270.dp)
                    .height(40.dp)
                    .padding(
                        vertical = 5.dp,
                    )
                    .background (
                        alpha = 0.3f,
                        brush = Brush.verticalGradient(listOf(Color.White, Color.Transparent)),
                        shape = RoundedCornerShape(40f)
                    ),
                fontSize = 20.sp,
                text = title,
                color = Color.White,
                textAlign = TextAlign.Center
            )
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color.Transparent
        ),
        actions = { actions() },
        navigationIcon = { navigationIcon() }
    )

}