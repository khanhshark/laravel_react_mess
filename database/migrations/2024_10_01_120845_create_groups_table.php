<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            // id tham chiếu đên id bản user nếu bảng user bị xóa thì cascade liên quan cx bị xóa 
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade'); 
            $table->timestamps();
        });

        Schema::create('group_users', function (Blueprint $table) {
            $table->id();
            // id tham chiếu đên id bản group nếu bảng group bị xóa thì cascade liên quan cx bị xóa 
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade'); 
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_users');
        Schema::dropIfExists('groups');
    }
};
