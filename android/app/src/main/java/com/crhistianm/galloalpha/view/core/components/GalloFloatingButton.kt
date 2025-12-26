package com.crhistianm.galloalpha.view.core.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FloatingActionButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun GalloFloatingButton(
    onClick: () -> Unit,
    content: @Composable () -> Unit
) {

    val interactionSource = remember { MutableInteractionSource() }
    val isPressed: Boolean by interactionSource.collectIsPressedAsState()
    val animatedColor: Color by animateColorAsState(
        targetValue = if(isPressed) Color(0xFF467C61)else Color.Gray
    )

    FloatingActionButton (
        modifier = Modifier
            .size(65.dp)
            .border(
                width = 2.dp,
                brush = Brush.linearGradient(listOf(Color.Cyan, Color.Yellow)),
                shape = RoundedCornerShape(50f)
            ),
        onClick = { onClick() },
        contentColor = Color.Black,
        interactionSource = interactionSource,
        containerColor = animatedColor,
    ) {
        content()
    }
}
