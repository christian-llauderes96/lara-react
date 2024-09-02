<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
       $creds = $request->validated();
       if(!Auth::attempt($creds)){

            return response([
                "message" => "Email or Password Incorrect!"
            ], 422);
       }

       $user = Auth::user();
       $token = $user->createToken("main")->plainTextToken;
       return response(compact('user','token'));

    }
    public function register(RegisterRequest $request){
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);
        /** @var User $user */
        $token = $user->createToken("main")->plainTextToken;
        return response(compact('user','token'));
    }
    public function logout(Request $request){
        /** @var User $user */
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
            return response("", 204);
        }
    
        return response()->json(['error' => 'User not authenticated or no valid token found.'], 401);
    }
}
