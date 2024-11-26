<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    protected $fillable=[
        'user_id1',
        'user_id2',
        'last_message_id'
        
    ];
    public function lastMessages(){
        return $this->belongsTo(Messenger::class,'last_message_id');
    }
    public function user1(){
        return $this->belongsTo(User::class,'user_id1');
    }
    public function user2(){
        return $this->belongsTo(User::class,'user_id2');
    }
    public static function getConversationsForSidebar(User $user){
        $users = User::getUsersExceptUser($user);#! xem thử trờ truyện vs ai
        $groups = Group::getGroupsExceptUser($user);#! xem thử trờ truyện vs nhóm nào
        return $users->map(function(User $user){
            return $user->toConversationArray();
        })->concat($groups->map(function(Group $group){ # nối cuộc trờ chuyện
            return $group->toConversationArray();
        }));
    }
}
