
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public authentication routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Public read routes
|--------------------------------------------------------------------------
*/

Route::apiResource('posts', PostController::class)
    ->only(['index', 'show']);

Route::apiResource('posts.comments', CommentController::class)
    ->only(['index', 'show']);

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('posts', PostController::class)
        ->except(['index', 'show']);

    Route::patch(
        'posts/{post}/status',
        [PostController::class, 'updateStatus']
    );

    Route::apiResource('posts.comments', CommentController::class)
        ->except(['index', 'show']);

    Route::post(
        'users/{user}/assign-role',
        [UserController::class, 'assignRole']
    );

    Route::post(
        'users/{user}/remove-role',
        [UserController::class, 'removeRole']
    );
});

/*
|--------------------------------------------------------------------------
| Demo routes
|--------------------------------------------------------------------------
*/

Route::post('/test-post', function (Request $request) {
    return response()->json([
        'message' => 'Post received!',
        'data' => $request->all(),
    ]);
});

Route::post('/demo-posts', function (Request $request) {
    $data = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required',
    ]);

    $post = Post::create($data);

    return response()->json($post, 201);
});
